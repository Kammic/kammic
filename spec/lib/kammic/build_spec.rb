require 'spec_helper'

describe Kammic::Build do
  before do
    create_user(id: 1234)
    create_repo(id: 42, user_id: 1234)
    Book.create!(id: 1234, repo_id: 42, user_id: 1234)
  end

  context '#queue' do
    it 'queues a build w/ #queue' do
      stub_const "QC", double("QC")
      QC.should_receive(:enqueue).with("Kammic::Build.update", 1234)

      Kammic::Build.queue(1234)
    end

    it 'doesnt call QC.enqueue when the book is not found' do
      stub_const "QC", double("QC")
      QC.should_not_receive(:enqueue)

      Kammic::Build.queue(11111)
    end

    it 'creates a Build stub' do
      Kammic::Build.queue(1234)
      build = Build.find_by_book_id(1234)

      expect(build).to_not be_nil
      expect(build[:started_at]).to_not be_nil
      expect(build[:ended_at]).to be_nil

      expect(build[:status]).to eq('created')
    end

  end

  context '#update' do
    before do
      commit_hash = {
        author:         'User',
        revision:       '1234',
        commit_message: 'the commit',
        branch:         'master'
      }
      Kammic::Build.stub(:last_commit_info).and_return commit_hash
      ::Build.create!(book_id: 1234)
    end

    it 'calls QC.enque on execute' do
      stub_const "QC", double("QC")
      QC.should_receive(:enqueue).with("Kammic::Build.execute", 1234)

      Kammic::Build.update(1234)
    end

    it 'updates the builds commit info' do
      Kammic::Build.update(1234)

      build = ::Build.find_by_book_id(1234)
      expect(build[:revision]).to eq('1234')
      expect(build[:author]).to eq('User')
      expect(build[:commit_message]).to eq('the commit')
    end
  end

  context '#execute' do

    it 'returns false when the book is not found' do
      expect(Kammic::Build.execute(11111)).to eq(false)
    end

    it 'marks the build failed if build errors' do
      ::Build.create!(book_id: 1234, status: 'created', started_at: Time.now)
      Kammic::Build.stub(:build_book).and_raise(Exception)

      Kammic::Build.execute(1234)
      build = ::Build.find_by_book_id(1234)
      expect(build[:status]).to eq('failed')
    end

    it 'marks a build completed at the end' do
      ::Build.create!(book_id: 1234, status: 'created', started_at: Time.now)

      Kammic::Build.execute(1234)

      build = ::Build.find_by_book_id(1234)
      expect(build[:status]).to eq('completed')
      expect(build[:ended_at]).to_not be_nil
    end
  end
end

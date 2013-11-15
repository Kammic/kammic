require 'spec_helper'

describe Kammic::Build do
  before do
    create_user(id: 1234)
    create_repo(id: 42, user_id: 1234)
    Book.create!(id: 1234, repo_id: 42, user_id: 1234)
  end

  let(:subject) { Kammic::Build }

  context '#queue' do
    it 'queues a build w/ #queue' do
      stub_const "QC", double("QC")
      QC.should_receive(:enqueue).with("Kammic::Build.update", anything)

      subject.queue(1234)
    end

    it 'doesnt call QC.enqueue when the book is not found' do
      stub_const "QC", double("QC")
      QC.should_not_receive(:enqueue)

      subject.queue(11111)
    end

    it 'creates a Build stub' do
      subject.queue(1234)
      build = Build.find_by_book_id(1234)

      expect(build).to_not be_nil
      expect(build[:started_at]).to_not be_nil
      expect(build[:ended_at]).to be_nil

      expect(build[:status]).to eq('created')
      expect(Build.count).to eq(1)
    end

  end

  context '#update' do
    before do
      commit_hash = {
        author:         'User',
        revision:       '1234',
        commit_message: 'the commit',
        branch:         'master',
        deletions:      1,
        additions:      2
      }
      subject.stub(:last_commit_info).and_return commit_hash
      ::Build.create!(id: 99, book_id: 1234)
    end

    it 'calls QC.enque on execute' do
      stub_const "QC", double("QC")
      QC.should_receive(:enqueue).with("Kammic::Build.execute", 99)

      subject.update(99)
    end

    it 'updates the builds commit info' do
      subject.update(99)

      build = ::Build.find_by_book_id(1234)
      expect(build[:revision]).to eq('1234')
      expect(build[:author]).to eq('User')
      expect(build[:commit_message]).to eq('the commit')
      expect(build[:deletions]).to eq(1)
      expect(build[:additions]).to eq(2)
    end

    it 'updates the build status to building' do
      subject.update(99)
      build = ::Build.find_by_book_id(1234)
      expect(build[:status]).to eq('building')
    end
  end

  context '#build_book' do
    before do
      ::Build.create!({id: 98, 
                       book_id: 1,
                       status:'created', 
                       revision: 'xyz',
                       started_at: Time.now})
    end

    it 'calls generate on the generator' do
      double = double()
      subject.stub(:generator).and_return(double)
      double.should_receive(:generate)

      subject.send(:build_book, Book.find(1234), Build.find(98))
    end

    it 'returns a hash of generated files and revision' do
      subject.stub(:generate)
      hash = subject.send(:build_book, Book.find(1234), Build.find(98))

      expect(hash.count).to eq(1)
      expect(hash["xyz.pdf"]).to eq("/tmp/xyz.pdf")
    end

  end

  context '#upload_book' do
    before do
      stub_const "S3::Service", double("S3::Service").as_null_object

      @double  = double().as_null_object
      subject.stub(:s3_bucket).and_return(@double)
      subject.stub(:open_file).and_return(@double)
      @paths = {'1234.pdf' => '/tmp/1234.pdf',
        '0000.Mobi' => '/tmp/0000.Mobi',
        '0000.epub' => '/tmp/0000.epub'}
      end

      it 'calls build on each bucket.object' do
        @double.stub(:objects).and_return(@double)
        @double.should_receive(:build).with("1234.pdf")
        @double.should_receive(:build).with("0000.Mobi")
        @double.should_receive(:build).with("0000.epub")

        subject.send(:upload_book, @paths)
      end

      it 'sets the content of each object' do
        @double.stub(:build).and_return(@double)
        subject.should_receive(:open_file).exactly(3).times
        @double.should_receive(:content=).exactly(3).times

        subject.send(:upload_book, @paths)
      end

      it 'calls save on each object' do
        @double.stub(:build).and_return(@double)
        @double.should_receive(:save).exactly(3).times

        subject.send(:upload_book, @paths)
      end

      it 'returns the urls of uploaded objects' do
        @double.stub(:build).and_return(@double)
        subject.stub(:open_file).and_return('')
        @double.stub(:url).and_return('some_url')
        urls = subject.send(:upload_book, @paths)
        expect(urls['1234.pdf']).to eq('some_url')
        expect(urls['0000.Mobi']).to eq('some_url')
        expect(urls['0000.epub']).to eq('some_url')
      end
  end

  context '#complete_build' do
    it 'sets the build to complete status' do
      build = create_build(id: 45, book_id: 1)
      subject.send(:complete_build, build)
      expect(build.status).to eq(:completed)
    end

    it 'sets the assets to the passed in URLs' do
      build = create_build(id: 45, book_id: 1)
      urls  = {'1.pdf' => 'something.com/1.pdf'}
      subject.send(:complete_build, build, urls)
      expect(build.assets).to eq(urls)
    end
  end

  context '#execute' do
    def default_hash
      {id: 98, book_id: 1234, status: 'created', started_at: Time.now}
    end

    before do
      ::Build.create! default_hash
    end

    it 'returns false when the book is not found' do
      build = ::Build.find(98)
      build.book_id = 0
      build.save!
      expect(subject.execute(98)).to eq(false)
    end

    it 'marks the build failed if build errors' do
      subject.stub(:build_book).and_raise(Exception)
      subject.execute(98)
      build = ::Build.find_by_book_id(1234)
      expect(build[:status]).to eq('failed')
    end

    it 'marks a build completed at the end' do
      subject.stub(:update_with_commit_info)
      subject.stub(:upload_book)
      subject.should_receive(:build_book).with(anything, anything)
      subject.execute(98)

      build = ::Build.find_by_book_id(1234)
      expect(build[:status]).to eq('completed')
      expect(build[:ended_at]).to_not be_nil
    end

    it 'calls upload_book' do
      subject.stub(:build_book)
      subject.stub(:update_with_commit_info)

      subject.should_receive(:upload_book)
      subject.execute(98)
    end
  end
end

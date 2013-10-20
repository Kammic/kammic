require 'spec_helper'

describe Kammic::HashCleaner do
  context '#clean' do
    it 'returns only allowed attributes in Constant' do
      dirty_hash = {id: 1235, title: 'xyz', something_else: false}
      clean_hash = Kammic::HashCleaner.clean(dirty_hash, ["id", "title"])

      expect(clean_hash[:id]).to eq(1235)
      expect(clean_hash[:title]).to eq('xyz')
      expect(clean_hash[:something_else]).to be_nil
    end
  end
end

module Kammic
  class HashCleaner
    def self.clean(hash, allowed_keys)
      hash         = hash.with_indifferent_access
      clean_hash   = {}.with_indifferent_access
      allowed_keys.each do |key|
        clean_hash[key] = hash[key]
      end
      clean_hash
    end
  end
end

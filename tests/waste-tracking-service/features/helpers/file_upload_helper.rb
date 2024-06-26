# frozen_string_literal: true

# Module is for ruby methods
module FileUploadHelper

  @file_type = {
    PDF: 'testpdf.pdf',
    VALID: 'test-csv.csv',
    INVALID: 'test-csv-failed.csv'
  }

  def self.get_file_name(file_type)
    @file_type[file_type.to_sym]
  end

  def self.get_upload_file(file_name)
    path = "#{File.dirname(__FILE__)}/../data/glw_multiples/#{@file_type[file_name.to_sym]}"
    File.expand_path(path)
  end

  def self.file_exists?(file_name)
    File.exist?(get_upload_file(file_name))
  end
end

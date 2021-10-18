# app/helpers/enum_i18n_helper.rb
module EnumI18nHelper
  # Returns an array of the possible key/i18n values for the enum
  # Example usage:
  # enum_options_for_select(Quizzes::Quiz, :grade)
  def enum_options_for_select(class_name, enum)
    class_name.send(enum.to_s.pluralize).map do |key, _|
      [I18n.t("#{enum.to_s.pluralize}.#{key}", scope: [:enums, class_name.model_name.i18n_key]), key]
    end
  end
end

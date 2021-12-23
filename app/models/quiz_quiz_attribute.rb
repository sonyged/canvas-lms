class QuizQuizAttribute < ApplicationRecord
  SUBJECTS = %w[math japanese english science social_studies others]
  GRADES = %w[g1 g2 g3 g4 g5 g6 g7 g8 g9]

  enum subject: SUBJECTS, _prefix: true
  enum grade: GRADES, _prefix: true

  belongs_to :quiz, class_name: "Quizzes::Quiz"
  belongs_to :quiz_attribute, optional: true

  def to_hash
    {
      id: self.id,
      subject: self.subject,
      grade: self.grade,
      area: self.quiz_attribute&.area,
      unit: self.quiz_attribute&.unit,
      type: self.quiz_attribute&.type,
      quiz_attribute_id: self.quiz_attribute_id
    }
  end
end

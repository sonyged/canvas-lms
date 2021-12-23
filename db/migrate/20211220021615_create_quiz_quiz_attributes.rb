class CreateQuizQuizAttributes < ActiveRecord::Migration[6.0]
  tag :predeploy

  def change
    create_table :quiz_quiz_attributes do |t|
      t.references :quiz, foreign_key: true, index: true
      t.references :quiz_attribute, foreign_key: true, index: true

      t.integer :subject
      t.integer :grade

      t.timestamps
    end
  end
end

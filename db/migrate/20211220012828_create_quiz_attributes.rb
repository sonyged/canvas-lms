class CreateQuizAttributes < ActiveRecord::Migration[6.0]
  tag :predeploy

  def change
    create_table :quiz_attributes do |t|
      t.integer :subject
      t.integer :grade
      t.integer :area
      t.integer :unit
      t.integer :type
      t.string :code

      t.timestamps
    end

    reversible do |dir|
      dir.up do
        QuizAttribute.create_translation_table! sub_unit: :string
      end

      dir.down do
        QuizAttribute.drop_translation_table!
      end
    end
  end
end

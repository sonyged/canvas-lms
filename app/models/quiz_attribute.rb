class QuizAttribute < ApplicationRecord
  # disable STI to allow columns named "type"
  self.inheritance_column = nil

  translates :sub_unit
  globalize_accessors locales: [:en, :ja], attributes: [:sub_unit]

  SUBJECTS = %w[math japanese english science social_studies others]
  GRADES = %w[g1 g2 g3 g4 g5 g6 g7 g8 g9]
  AREAS = %w[numbers_calculations diagrams measurement data_utilization change_relationships numbers_expressions functions]
  TYPES = %w[knowledge_skills ability_think_judge_express]
  UNITS = ["number_construction_representation",
    "addition_subtraction",
    "shapes_things",
    "size_objects",
    "time",
    "organizing_quantities",
    "multiplication",
    "diagrams",
    "units_measurement_quantities",
    "analyzing_data",
    "representing_integers",
    "division",
    "decimals_representation",
    "fractions_representation",
    "expressions_expressing_relationships_between_quantities",
    "representing_calculating_numbers_using_abacus",
    "approximate_numbers",
    "division_integers",
    "decimalscalculations",
    "fractionsaddition_subtraction",
    "properties_computation",
    "plane_figures",
    "three_dimensional_figures",
    "position_objects",
    "area_plane_figures",
    "angle",
    "two_quantities_changing_each_other",
    "relationship_between_two_quantities",
    "collection_data_its_analysis",
    "properties_integers_composition_integers",
    "expression_integers_decimals",
    "multiplication_division_decimals",
    "fractions",
    "addition_subtraction_fractions",
    "volume_three_dimensional_figures",
    "quantities_proportions_two_dissimilar_quantities",
    "average_results_a_measurement",
    "multiplication_division_fractions",
    "approximate_shapes_approximate_areas_shapes",
    "possible_cases",
    "positive_negative_numbers",
    "expressions_using_letters",
    "linear_equations",
    "spatial_figures",
    "proportion_inverse_proportion",
    "distribution_data",
    "ease_occurrence_uncertain_events",
    "properties_basic_plane_figures",
    "congruence_figures",
    "linear_functions",
    "square_roots_positive_numbers",
    "simple_polynomial_equations",
    "quadratic_equations",
    "similarity_figures",
    "relationship_between_circumferential_angle_central_angle",
    "three_square_theorem",
    "function_y=ax^2",
    "sample_survey"]

  enum subject: SUBJECTS, _prefix: true
  enum grade: GRADES, _prefix: true
  enum area: AREAS, _prefix: true
  enum unit: UNITS, _prefix: true
  enum type: TYPES, _prefix: true

  has_many :quiz_quiz_attributes, dependent: :destroy
end

/*
 * Copyright (C) 2020 - present Instructure, Inc.
 *
 * This file is part of Canvas.
 *
 * Canvas is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * Canvas is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import React from 'react'
import { func, array, object, number, bool } from 'prop-types'
import I18n from 'i18n!quiz_quiz_attribute'

export default class QuizQuizAttribute extends React.Component {
  static propTypes = {
    subjectOptions: array.isRequired,
    gradeOptions: array.isRequired,
    areaOptions: array.isRequired,
    unitOptions: array.isRequired,
    typeOptions: array.isRequired,
    subUnitOptions: array.isRequired,
    quizQuizAttribute: object.isRequired,
    onDeleteClick: func.isRequired,
    index: number.isRequired,
    deleted: bool
  }

  constructor(props) {
    super(props)

    this.state = {
      selectedSubject: props.quizQuizAttribute.subject || '',
      selectedGrade: props.quizQuizAttribute.grade || '',
      selectedSubUnitId: props.quizQuizAttribute.quiz_attribute_id || '',
      selectedArea: props.quizQuizAttribute.area || '',
      selectedUnit: props.quizQuizAttribute.unit || '',
      selectedType: props.quizQuizAttribute.type || '',
    }
  }

  render() {
    return (
      <div>
        {this.renderHiddenId()}
        {this.renderHiddenDestroy()}
        {this.renderInputs()}
      </div>
    )
  }

  renderInputs() {
    if (!this.props.deleted) {
      return (
        <div>
          {this.renderSubjectOptions()}
          {this.renderGradeOptions()}
          {(this.state.selectedSubject == 'math') && this.renderSubUnitSelection()}
          {this.renderDeleteButton()}
        </div>
      )
    }
  }

  renderHiddenId() {
    if (this.props.quizQuizAttribute.id) {
      return (
        <input type="hidden"
          value={this.props.quizQuizAttribute.id}
          name={`quiz[quiz_quiz_attributes_attributes][${this.props.index}][id]`}
        >
        </input>
      )
    }
  }
  renderHiddenDestroy() {
    if (this.props.quizQuizAttribute.id && this.props.deleted) {
      return (
        <input type="hidden"
          value={this.props.deleted}
          name={`quiz[quiz_quiz_attributes_attributes][${this.props.index}][_destroy]`}
        >
        </input>
      )
    }
  }

  renderSubjectOptions() {
    return (
      <div className="control-group">
        <label className="control-label">{I18n.t('subject')}</label>
        <div className="controls">
          <select name={`quiz[quiz_quiz_attributes_attributes][${this.props.index}][subject]`}
            value={this.state.selectedSubject} onChange={this.handleSelectSubject}>
            <option value="" label=" "></option>
            {this.props.subjectOptions.map(subjectOption =>
              <option key={subjectOption[1]} value={subjectOption[1]}>
                {subjectOption[0]}
              </option>)}
          </select>
        </div>
      </div>
    )
  }

  handleSelectSubject = (event) => {
    this.setState({ selectedSubject: event.target.value });
  }

  renderGradeOptions() {
    return (
      <div className="control-group">
        <label className="control-label">{I18n.t('grade')}</label>
        <div className="controls">
          <select name={`quiz[quiz_quiz_attributes_attributes][${this.props.index}][grade]`}
            value={this.state.selectedGrade} onChange={this.handleSelectGrade}>
            <option value="" label=" "></option>
            {this.props.gradeOptions.map(gradeOption =>
              <option key={gradeOption[1]} value={gradeOption[1]}>
                {gradeOption[0]}
              </option>)}
          </select>
        </div>
      </div>
    )
  }

  handleSelectGrade = (event) => {
    this.setState({ selectedGrade: event.target.value });
  }

  renderSubUnitSelection() {
    return (
      <div>
        {this.renderAreaOptions()}
        {this.renderUnitOptions()}
        {this.renderTypeOptions()}
        {this.renderSubUnitOptions()}
      </div>
    )
  }

  renderAreaOptions() {
    return (
      <div className="control-group">
        <label className="control-label">{I18n.t('area', 'Area')}</label>
        <div className="controls">
          <select value={this.state.selectedArea} onChange={this.handleSelectArea}>
            <option value="" label=" "></option>
            {this.getAvailableArea().map(areaOption =>
              <option key={areaOption[1]} value={areaOption[1]}>
                {areaOption[0]}
              </option>)}
          </select>
        </div>
      </div>
    )
  }

  handleSelectArea = (event) => {
    this.setState({ selectedArea: event.target.value, selectedUnit: '', selectedType: '', selectedSubUnitId: '' });
  }

  getAvailableArea() {
    const allAvailableArea = this.getAvailableSubUnitOptions(['subject', 'grade']).map(subUnit => subUnit.area)

    return this.props.areaOptions.filter(areaOption => {
      if (allAvailableArea.includes(areaOption[1])) {
        return true
      } else {
        return false
      }
    })
  }

  renderUnitOptions() {
    return (
      <div className="control-group">
        <label className="control-label">{I18n.t('unit', 'Unit')}</label>
        <div className="controls">
          <select value={this.state.selectedUnit} onChange={this.handleSelectUnit}>
            <option value="" label=" "></option>
            {this.getAvailableUnits().map(unitOption =>
              <option key={unitOption[1]} value={unitOption[1]}>
                {unitOption[0]}
              </option>)}
          </select>
        </div>
      </div>
    )
  }

  handleSelectUnit = (event) => {
    this.setState({ selectedUnit: event.target.value, selectedType: '', selectedSubUnitId: '' });
  }

  getAvailableUnits() {
    const allAvailableUnits = this.getAvailableSubUnitOptions(['subject', 'grade', 'area']).map(subUnit => subUnit.unit)

    return this.props.unitOptions.filter(unitOption => {
      if (allAvailableUnits.includes(unitOption[1])) {
        return true
      } else {
        return false
      }
    })
  }

  renderTypeOptions() {
    return (
      <div className="control-group">
        <label className="control-label">{I18n.t('type', 'Type')}</label>
        <div className="controls">
          <select value={this.state.selectedType} onChange={this.handleSelectType}>
            <option value="" label=" "></option>
            {this.getAvailableTypes().map(typeOption =>
              <option key={typeOption[1]} value={typeOption[1]}>
                {typeOption[0]}
              </option>)}
          </select>
        </div>
      </div>
    )
  }

  handleSelectType = (event) => {
    this.setState({ selectedType: event.target.value, selectedSubUnitId: '' });
  }

  getAvailableTypes() {
    const allAvailableTypes = this.getAvailableSubUnitOptions(['subject', 'grade', 'area', 'unit']).map(subUnit => subUnit.type)

    return this.props.typeOptions.filter(typeOption => {
      if (allAvailableTypes.includes(typeOption[1])) {
        return true
      } else {
        return false
      }
    })
  }

  renderSubUnitOptions() {
    return (
      <div className="control-group">
        <label className="control-label" htmlFor="quiz_subject">{I18n.t('sub_unit', 'Sub Unit')}</label>
        <div className="controls">
          <select name={`quiz[quiz_quiz_attributes_attributes][${this.props.index}][quiz_attribute_id]`}
            value={this.state.selectedSubUnitId} onChange={this.handleSelectSubUnit}>
            <option value="" label=" "></option>
            {this.getAvailableSubUnits().map(subUnitOption =>
              <option key={subUnitOption.id} value={subUnitOption.id}>
                {subUnitOption.sub_unit}
              </option>)}
          </select>
        </div>
      </div>
    )
  }

  handleSelectSubUnit = (event) => {
    this.setState({ selectedSubUnitId: event.target.value });
  }

  getAvailableSubUnits() {
    const allAvailableSubUnits = this.getAvailableSubUnitOptions(['subject', 'grade', 'area', 'unit', 'type']).map(subUnit => subUnit.id)

    return this.props.subUnitOptions.filter(subUnitOption => {
      if (allAvailableSubUnits.includes(subUnitOption.id)) {
        return true
      } else {
        return false
      }
    })
  }

  getAvailableSubUnitOptions(filterFields = []) {
    return this.props.subUnitOptions.filter(subUnit => {
      if (this.state.selectedSubject && filterFields.includes('subject')) {
        if (subUnit.subject !== this.state.selectedSubject) return false
      }
      if (this.state.selectedGrade && filterFields.includes('grade')) {
        if (subUnit.grade !== this.state.selectedGrade) return false
      }
      if (this.state.selectedArea && filterFields.includes('area')) {
        if (subUnit.area !== this.state.selectedArea) return false
      }
      if (this.state.selectedUnit && filterFields.includes('unit')) {
        if (subUnit.unit !== this.state.selectedUnit) return false
      }
      if (this.state.selectedType && filterFields.includes('type')) {
        if (subUnit.type !== this.state.selectedType) return false
      }
      return true
    })
  }

  renderDeleteButton() {
    return (
      <div className="control-group">
        <label className="control-label"></label>
        <div className="controls">
          <button className="Button" type="button" onClick={this.props.onDeleteClick}>
            <i className="icon-x" role="presentation"></i>
            <span className="screenreader-only">Delete set of quiz attributes</span>
            <span aria-hidden="true">Delete</span>
          </button>
        </div>
      </div>
    )
  }
}

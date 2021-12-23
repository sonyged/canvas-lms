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
import {array} from 'prop-types'
import QuizQuizAttribute from './QuizQuizAttribute'

export default class QuizAttributeSelection extends React.Component {
  static propTypes = {
    subjectOptions: array.isRequired,
    gradeOptions: array.isRequired,
    areaOptions: array.isRequired,
    unitOptions: array.isRequired,
    typeOptions: array.isRequired,
    subUnitOptions: array.isRequired,
    quizQuizAttributes: array.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      quizQuizAttributes: props.quizQuizAttributes
    }
  }

  render() {
    return (
      <div>
        {this.state.quizQuizAttributes.map((attribute, index) => {
          return (
            <QuizQuizAttribute
              key={index}
              subjectOptions={this.props.subjectOptions}
              gradeOptions={this.props.gradeOptions}
              areaOptions={this.props.areaOptions}
              unitOptions={this.props.unitOptions}
              typeOptions={this.props.typeOptions}
              subUnitOptions={this.props.subUnitOptions}
              quizQuizAttribute={attribute}
              deleted={attribute.deleted}
              index={index}
              onDeleteClick={this.onDeleteClick(index)}
            />
          )
        })}
        {this.state.quizQuizAttributes.length < 3 && this.renderAddButton()}
      </div>
    )
  }

  renderAddButton() {
    return (
      <button className="Button" type="button" onClick={this.handleClickAddButton}>
        <i className="icon-plus" role="presentation" />
        <span className="screenreader-only">Add new set of quiz attributes</span>
        <span aria-hidden="true">Add quiz attributes</span>
      </button>
    )
  }

  getVisibleQuizAttributes() {
    this.state.quizQuizAttributes.filter(attr => !attr.deleted)
  }

  handleClickAddButton = () => {
    this.setState({quizQuizAttributes: this.state.quizQuizAttributes.concat({new: true})})
  }

  onDeleteClick = index => {
    return () => {
      const quizQuizAttributes = this.state.quizQuizAttributes
      if (quizQuizAttributes[index].id) {
        quizQuizAttributes[index].deleted = true
        this.setState({quizQuizAttributes})
      } else {
        quizQuizAttributes.splice(index, 1)
        this.setState({quizQuizAttributes})
      }
    }
  }
}

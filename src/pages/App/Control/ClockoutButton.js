// @flow
import React, { Component } from 'react'
import { ClockBoardQuery } from '../../../graphql/query'
import { graphql } from 'react-apollo'
import { compose } from 'redux'
import gql from 'graphql-tag'
import { Button } from '../../../elements/Button'
import { theme } from '../../../const'

type User = {
  id: string,
  clocks: Array<{
    id: string
  }>
}
type GraphQLData = {
  user: User,
  loading: boolean
}

type Props = {
  data: GraphQLData,
  mutation: Function
}

const mutation = gql`
  mutation($clockId: ID!, $userId: ID!, $clockOut: DateTime) {
    updateClock(id: $clockId, userId: $userId, clockOut: $clockOut) {
      id
      clockIn
      clockOut
    }
    updateUser(id: $userId, isDuringClockIn: false) {
      id
      isDuringClockIn
      clocks(last: 1) {
        id
        clockIn
        clockOut
      }
    }
  }
`

export class ClockoutButton extends Component<Props> {
  gqlLogic: Function

  constructor(props: Props): void {
    super(props)
    this.gqlLogic = this.gqlLogic.bind(this) // avoid Class properties arrow function bind in order to test mocking
  }

  gqlLogic(): void {
    const { data, mutation } = this.props

    const userId = data.user.id
    const clockId = data.user.clocks[0].id

    mutation({
      variables: {
        clockId: clockId,
        userId: userId,
        clockOut: new Date().toISOString()
      }
    }).catch(e => {
      console.log(e)
      alert('error occurred when updateClock on clockout')
    })
  }

  render() {
    const { data } = this.props
    if (data.loading) return null

    return (
      <Button
        primary
        color={theme.red}
        onClick={this.gqlLogic}
        enzyme-testid="clock-out-btn"
      >
        clock out
      </Button>
    )
  }
}

export default compose(
  graphql(ClockBoardQuery),
  graphql(mutation, {
    name: 'mutation'
  })
)(ClockoutButton)

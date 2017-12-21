// @flow
import React, { Component } from 'react'
import { AUTH0_ID_TOKEN } from '../common/Const'
import { Button } from '../common/components/Button'

type Props = {}

export class LogoutButton extends Component<Props> {
  logout = () => {
    window.localStorage.removeItem(AUTH0_ID_TOKEN)
    window.location.reload()
  }

  render() {
    return (
      <MyButton onClick={this.logout} data-test="logout-btn">
        Logout
      </MyButton>
    )
  }
}

const MyButton = Button.extend`
  color: #78909c;
  border: 2px solid #78909c;
`

export default LogoutButton

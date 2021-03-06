// @flow
import React, { Component } from 'react'
import { compose, pure } from 'recompose'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'
import type { HISTORY_BOARD_QUERY_TYPE } from '../../../graphql/query'
import { HISTORY_BOARD_QUERY } from '../../../graphql/query'
import { calcTotalTimeWithoutSec, ISOtoYmd } from '../../../functions'
import InTime from './InTime'
import OutTime from './OutTime'
import Select from './HistoryFilter'
import DeleteCheckbox from './DeleteCheckbox'
import DeleteButton from './DeleteButton'
import {
  Container,
  ControlArea,
  DeleteCheckboxTd,
  DeleteCheckboxTh,
  Header,
  Table,
  Tbody,
  Td,
  Th,
  Tr
} from './index.style'
import type { Dispatch } from 'redux'
import type { ReduxAction } from '../../../types/action'
import type { ReduxState } from '../../../reducer'
import type { OperationOption, QueryOpts } from 'react-apollo'

type StateProps = {|
  checkedHistoryIdList: Array<string>
|}

type Props = {
  ...StateProps,
  data: HISTORY_BOARD_QUERY_TYPE,
  dispatch: Dispatch<ReduxAction>
}

class History extends Component<Props> {
  bottomBoerderEliminator(length: number, i: number): Object {
    return length === i + 1
      ? {
          borderBottomWidth: 1,
          borderBottomColor: '#fff',
          borderBottomStyle: 'solid'
        }
      : {}
  }

  render() {
    const { loading } = this.props.data
    if (loading) return null

    const { clocks } = this.props.data.user

    var history = []
    if (clocks.length) {
      const filtered = clocks
        // must have complate clock in/out. not allow only clock in data of first time.
        .filter(v => {
          return v.clockOut !== null // during clock-in data. can not calculate totalTime when clockout was null.
        })
      const length = filtered.length

      history = filtered.map((v, i) => {
        const clockIn = v.clockIn
        const clockOut = v.clockOut
        if (clockIn === null || clockOut === null) {
          throw new Error(
            'LogicException: Invalid Data. History query should not fetch clockIn or ClockOut == null.'
          )
        }
        const createdAt = v.createdAt
        const clockId = v.id
        const small = new Date(clockIn)
        const large = new Date(clockOut)
        const total = calcTotalTimeWithoutSec(large, small)

        return (
          <tr style={this.bottomBoerderEliminator(length, i)} key={i}>
            <DeleteCheckboxTd style={this.bottomBoerderEliminator(length, i)}>
              {/*TODO delete checkbox UI*/}
              <DeleteCheckbox clockId={clockId} />
            </DeleteCheckboxTd>
            <Td>{ISOtoYmd(createdAt)}</Td>
            <Td>{total}</Td>
            <InTime clockIn={clockIn} clockId={clockId} />
            <OutTime clockOut={clockOut} clockId={clockId} />
          </tr>
        )
      })
    }

    // clocks.length == 0 or clocks.lengh ===1 and clocks.[0] only has clockIn value without clockOut.
    if (history.length === 0) {
      history = (
        <Tr>
          <Td>N/A</Td>
          <Td>N/A</Td>
          <Td>N/A</Td>
          <Td>N/A</Td>
        </Tr>
      )
    }

    return (
      <Container>
        <Header>History</Header>
        <ControlArea>
          <Select />
          <DeleteButton
            checkedHistoryIdList={this.props.checkedHistoryIdList}
          />
        </ControlArea>
        <Table style={{ borderLeftWidth: 0 }}>
          <Tbody>
            <Tr>
              <DeleteCheckboxTh> </DeleteCheckboxTh>
              <Th>date</Th>
              <Th>total</Th>
              <Th>in</Th>
              <Th>out</Th>
            </Tr>
            {history}
          </Tbody>
        </Table>
      </Container>
    )
  }
}

const map: MapStateToProps = (state: ReduxState): StateProps => {
  return {
    checkedHistoryIdList: state.checkedHistoryIdList
  }
}

type TVariable = { first: 100, orderBy: 'createdAt_DESC' }

export default compose(
  connect<_, _, *, _, *, _, _>(map),
  graphql(
    HISTORY_BOARD_QUERY,
    ({
      options: ({
        variables: { first: 100, orderBy: 'createdAt_DESC' }
      }: QueryOpts<TVariable>)
    }: OperationOption<*, *, *, TVariable>)
  ),
  pure
)(History)

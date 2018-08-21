import React from 'react'
import { shallow } from 'enzyme'
import { Clock } from './Clock'
import type { CurrentTime } from '../types/CurrentTime'
import { parseTime } from '../../functions'

describe('<Clock />', () => {
  const currentTime: CurrentTime = parseTime(new Date())

  it('should render without error', () => {
    const wrapper = shallow(<Clock currentTime={currentTime} />)
    expect(wrapper.exists()).toBe(true)
  })

  it('should error without currentTime props', () => {
    expect(() => shallow(<Clock />)).toThrow()
  })
})
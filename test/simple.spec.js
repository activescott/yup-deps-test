import React from 'react'
import * as yup from 'yup'
import { mount } from 'enzyme'
import Form from 'react-formal'

describe('Field', () => {
  it('should mount', function() {
    let schema = yup.object({
      string: yup.string().meta({
        reactFormalType: 'number',
      }),
    })
    mount(
      <Form schema={schema} defaultValue={{}}>
        <Form.Field name="string" />
      </Form>
    )
  })
})

import React from 'react'
import { Avatar, Name, Wrapper } from './styled'
import { AccountStatusProps } from './types'

const AccountStatus: React.FC<AccountStatusProps> = ({ name, avatar }) => {
  return (
    <Wrapper>
      <Avatar src={avatar} />
      <Name>
        {name}
      </Name>
    </Wrapper>
  )
}

export default AccountStatus

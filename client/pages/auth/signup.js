import React, { useState } from 'react'
import Router from 'next/router'
import useRequest from '../../hooks/use-request'

const Signup = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { doRequest, errors } = useRequest({
        url: '/api/users/signup',
        method: 'post',
        body: {
            email, password
        },
        onSuccess: () => Router.push('/')
    }) 

    const onSubmit = async (event) => {
        event.preventDefault()

        await doRequest()
    }

    return (
        <form onSubmit={onSubmit}>
            <h1>Sign up</h1>
            <div className="form-group">
                <label htmlFor="">Email Address</label>
                <input 
                    className="form-control" 
                    type="text" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                />
            </div>
            <div className="form-group">
                <label htmlFor="">Password</label>
                <input 
                    className="form-control" 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                />
            </div>
            {errors}
            <button className="btn btn-primary">Sign up</button>
        </form>
    )
}

export default Signup

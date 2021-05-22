import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {auth} from '../_actions/user_action';

export default function (ComposedClass, option, adminRoute = null){

    function AuthenticationCheck(props) {

        let user = useSelector(state => state.user);
        const dispatch =  useDispatch();
        useEffect(()=>{
            dispatch(auth()).then(response => {
                //로그인 되지 않은 상태
                if(!response.payload.isAuth){
                    if(option){
                        props.history.push('/login');
                    }
                } else {
                    //로그인 된 상태
                    if(adminRoute && !response.payload.isAdmin){
                        props.history.push('/');
                    } else {
                        if(!option){
                            props.history.push('/');
                        }
                    }
                }
            })
        }, [])

        return (
            <ComposedClass {...props} user={user} />
        )

    }

    return AuthenticationCheck;
}
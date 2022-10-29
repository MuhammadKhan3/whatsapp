import { useRef } from 'react';
import { useRouter } from 'next/router'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Styles from '../styles/login.module.css'
import { useCookies } from 'react-cookie';
const { io } = require("socket.io-client");
const socket = io("http://localhost:8000");
function LoginPage() {
    const [cookies, setCookie] = useCookies(["userId","token"]);
    const router = useRouter()
    const email = useRef('');
    const password=useRef('');
    const SubmitHandler=(e)=>{
        e.preventDefault();
        const data={
            email:email.current.value,
            password:password.current.value,
        };
        fetch('http://localhost:8000/login',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(data),
        }).then((response)=>{
            return response.json();
        })
        .then((data)=>{
            if(data.flag){
                setCookie("userId",data.userId,{maxAge: 3600})
                setCookie("token",data.token,{maxAge:3600})
                router.push('/')
            }
        })
    }
  return (
    <Form className={Styles.login} onSubmit={SubmitHandler}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label className={Styles.text}>Email address</Form.Label>
        <Form.Control ref={email} className={Styles.input} type="email" placeholder="Enter email" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label className={Styles.text}>Password</Form.Label>
        <Form.Control ref={password}  type="password" placeholder="Password" className={Styles.input} />
      </Form.Group>
      {/* <Form.Group className={`mb-3 ${Styles.input}`} controlId="formBasicCheckbox" >
        <Form.Check type="checkbox" label="Check me out" />
      </Form.Group> */}
      <Button variant="primary" className={Styles.button} type="submit">
        Submit
      </Button>
    </Form>
  );
}

export default LoginPage;
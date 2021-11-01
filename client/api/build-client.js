import axios from 'axios'

const buildClient = ({ req }) => {
    // window is an object that only exist inside the browser
    if (typeof window === 'undefined') {
        // We are in the server
        // requests should be made to http://<SERVICE_NAME>.<NAMESPACE>.svc.cluster.local/....
        // req.headers have two important things.
        // HOST: 'ticketing.dev' => tell ingress what host the request want to
        // COOKIE: 'sdfsf' => from browser to auth service
        return axios.create({
            baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            headers: req.headers
        })
    } else {
        // We are on the client
        // request should be made with a base url of ''
        return axios.create({
            baseURL: '/'
        })
    }
   
}

export default buildClient

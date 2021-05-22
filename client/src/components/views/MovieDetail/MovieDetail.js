import React, {useEffect, useState} from 'react';
import {API_URL, API_KEY, IMAGE_BASE_URL} from '../../../config'
import MainImage from '../LandingPage/Sections/MainImage'
import MainInfo from './Sections/MovieInfo'
import GridCards from '../common/GridCards'
import { Row } from 'antd';

function MovieDetail(props) {
    console.log(props.match)
    let movieId = props.match.params.movieId
    const [Movie, setMovie] = useState([])
    const [Casts, setCasts] = useState([])
    const [ActorToggle, setActorToggle] = useState(false);

    useEffect(() => {
        const endpoint = `${API_URL}/movie/${movieId}?api_key=${API_KEY}`
        const endpointCrew = `${API_URL}/movie/${movieId}/credits?api_key=${API_KEY}`

        fetch(endpoint)
            .then(response => response.json())
            .then(response => {
                setMovie(response);
            })
        fetch(endpointCrew)
            .then(response => response.json())
            .then(response => {
                setCasts(response.cast);
            })
    }, [])

    const toggleActorView = () => {
        setActorToggle(!ActorToggle);
    }

    return (
        <div>
            <MainImage image = {`${IMAGE_BASE_URL}/w1280${Movie.backdrop_path}`} 
            title = {Movie.original_title} 
            text = {Movie.overview}/>

            <div style={{width:'85%', margin: '1rem auto'}}>
                
                <MainInfo 
                    movie = {Movie}
                />

                <br />

                <div style={{display: 'flex', justifyContent: 'center', margin:'2rem'}}>
                    <button onClick={toggleActorView}>Toggle Actor View</button>
                </div>
                {ActorToggle &&
                    <Row gutter={[16,16]}>
                        {Casts && Casts.map((cast, index) => (
                            <React.Fragment key={index}>
                                <GridCards 
                                    image = {cast.profile_path ? `${IMAGE_BASE_URL}/w500${cast.profile_path}` : null} 
                                    chracterName = {cast.name}    
                                />
                            </React.Fragment>
                        ))}

                    </Row>
                }

            </div>
        </div>

    );
}

export default MovieDetail;
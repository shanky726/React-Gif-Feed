import React, { useState } from 'react';
import { Button, CloseButton, OverlayTrigger, Popover, Spinner } from 'react-bootstrap';
import BoredApe from '../assets/boredApe.jpg'
import './Feed.css'


const Feed = () => {
    const GIPHY_API = "https://api.giphy.com/v1/gifs/search?api_key=FlVeQS5kItu8IRAyjnJD4CDp5TFkCBaJ&limit=25&offset=0&rating=g&lang=en&q=";
    const GIPHY_TRENDING_API="https://api.giphy.com/v1/gifs/trending?api_key=FlVeQS5kItu8IRAyjnJD4CDp5TFkCBaJ&limit=25&offset=0&rating=g&lang=en"
    const [post, setPost] = useState("");
    const [search, setSearch] = useState("");
    const [prevgif, setPrevGif] = useState("");
    const [gifList, setGifList] = useState([]);
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        addItemList(post);
        setSearch('');
        setGifList([]);
    }

    const addItemList = (post) => {
        let copy = [...list];
        copy.unshift({ 'text': post, 'gif': prevgif });
        //copy = [...copy, post];
        setList(copy);
        setPrevGif('');
        setPost('');
        setShow(false);
    }

    const searchGif = (e) => {
        //e.preventDefault();
        //setSearch('');
        setLoading(true);
        setSearch(e.target.value);

        if (e.target.value.length > 1) {
            fetch(GIPHY_API + e.target.value)
                .then((res) => {
                    setLoading(false);
                    return res.json();
                })
                .then((result) => {
                    //console.log(result)
                    setGifList(result.data.map((gif) => {
                        return gif.images.fixed_height.url;
                    }))

                })
                .catch((e) => {
                    setLoading(false);
                    alert("Something went wrong");
                })
        }
    }

    const fetchTrending =()=>{
        setLoading(true);
        fetch(GIPHY_TRENDING_API)
                .then((res) => {
                    setLoading(false);
                    return res.json();
                })
                .then((result) => {
                    //console.log(result)
                    setGifList(result.data.map((gif) => {
                        return gif.images.fixed_height.url;
                    }))

                })
                .catch((e) => {
                    setLoading(false);
                    alert("Something went wrong");
                })
    }

    const popover = (
        <Popover id="popover-basic" show={false} style={{ backgroundColor: "#242526" }}>

            <Popover.Body className='rounded shadow' style={{ backgroundColor: "#242526" }} >
                <div className='row px-2'>
                    <input spellcheck="false" className='rounded p-1 px-2' type='text' value={search} onChange={searchGif} placeholder="Search Gifs" style={{ color: "white", backgroundColor: "black" }}></input>
                </div>
                <div style={{ maxHeight: '300px', maxWidth: '300px', overflowY: 'scroll', marginTop: '10px' }}>
                    {!loading ? gifList.map((item, idx) => {
                        return (
                            <div className='align-items-column' onClick={() => { setPrevGif(item); setShow(false); }} key={idx}>
                                <img alt="loading..." src={item} />
                            </div>

                        )
                    }) : <div className='align-items-center justify-content-center d-flex my-3'> <Spinner animation="border" size="sm" variant="light" /></div>}
                </div>
            </Popover.Body>
        </Popover>
    );

    return (
        <div className='container'>
            <div className='row p-3'>
                <div className='col-md-2'>
                   
                </div>
                <div className='col-md-8 px-5 align-items-center'>
                    <div className='shadow rounded  px-3 py-2 mb-4' style={{ marginLeft: '20%', marginRight: '20%', backgroundColor: "#242526" }} >
                        <div className='row-md-2 flex-start d-flex align-items-center '>
                            <img src={BoredApe} style={{ borderRadius: '50%', height: '40px', marginRight: '2%' }} alt="Avatar" />
                            <span style={{ fontSize: '18px', fontWeight: "400" }}>Shashank</span>
                        </div>
                        <div className='row px-3 mt-3'>
                            <textarea style={{ fontSize: '16px', fontWeight: "200" }} spellcheck="false" rows="3" cols="50" placeholder="What's on your mind.." value={post} onChange={(e) => setPost(e.target.value)} ></textarea>
                        </div>
                        <div>
                            {prevgif.length ?
                                <div>
                                    <div className='d-flex flex-row-reverse'>
                                        <CloseButton variant="white" onClick={() => {
                                            setPrevGif(''); setSearch('');
                                            setGifList([]);
                                            setShow(false);
                                        }} />
                                    </div>
                                    <img src={prevgif} maxHeight="200px" width="400px" alt="previeing data"  />
                                </div> : null}
                        </div>
                        <div className='d-flex justify-content-between px-3 mt-3 border-top border-secondary pt-3 '>
                            <OverlayTrigger show={show} trigger="click" rootClose placement="bottom-start" overlay={popover}>
                                <Button size="sm" onClick={() => { setShow(!show); fetchTrending() }} variant="success"><span style={{color:"#242526",fontWeight:"700"}}>GIF</span></Button>
                            </OverlayTrigger>
                            <Button size="sm" onClick={handleSubmit} disabled={post.length > 0 || prevgif.length > 0 ? false : true}><span style={{fontWeight:"700"}}>Post</span></Button>
                        </div>

                    </div>
                    <div>
                        {list.length>0?list.map(item => {
                            return (
                                <div className='shadow rounded my-2 p-3' style={{ marginLeft: '20%', marginRight: '20%', backgroundColor: "#242526" }}>
                                    <div className='row-md-2 mb-2 flex-start d-flex align-items-center '>
                                        <img src={BoredApe} style={{ borderRadius: '50%', height: '40px', marginRight: '2%' }} alt="Avatar" />
                                        <span style={{ fontSize: '16px', fontWeight: "400" }}>Shashank</span>
                                    </div>
                                    {item.text.length > 0 ? <div className='d-flex align-items-start my-3'>
                                        <span style={{ fontSize: '16px', fontWeight: "200", marginLeft: "10px" }}>{item.text}</span>
                                    </div> : null}


                                    {item.gif.length > 0 ? <div className='mt-3'><img src={item.gif} /></div>  : null}
                                </div>

                            )
                        }):<span style={{fontSize:"25px",fontWeight:"600"}} >No posts yet!!!</span>}
                    </div>
                </div>
                <div className='col-md-2 '>
                   
                </div>
            </div>
        </div>

    )
}

export default Feed;

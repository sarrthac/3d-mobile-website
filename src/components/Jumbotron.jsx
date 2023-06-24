import React from 'react'
import Iphone from '../assets/images/iphone-14.jpg';
import HoldingIphone from '../assets/images/iphone-hand.png'

export default function Jumbotron() {


    //function to scroll down to sound section
    const handleLearnMore = () => {

        //taking the element to which we have to scroll
        const element = document.querySelector(".sound-section");
        
        //scroll to function helps in doing that which accepts couple of paramerters like postion (top/bottom), left for left scrolling and animation effect and many more
        window.scrollTo({

            //here ? is added as chaining operator so that if the defined elemt is not there plz don;t execute the function this will prevent the error.
            top: element?.getBoundingClientRect().top,
            left: 0,
            behavior: 'smooth'
        })
    }



  return (
    <div className='jumbotron-section wrapper'>
        <h2 className='title'>New</h2>
        <img className='logo' src = {Iphone} alt='iphone 14 Pro'/>
        <p className='text'>Big and bigger</p>
        <span className='description'>
            From $41.62/mo. for 24 mo. or $999 before trade-in
        </span>
        <ul className='links'>
            <li>
                <button className='button'>Buy</button>
            </li>
            <li>
                <a className='link' onClick={handleLearnMore}>Learn more</a>
            </li>
        </ul> 
        <img className='iphone-img' src={HoldingIphone} alt='iPhone' />
    </div>
  )
}

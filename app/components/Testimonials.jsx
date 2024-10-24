"use client";

// components/Testimonials.jsx
import React, { useState } from 'react';
import Image from 'next/image';
import './Testimonials.css';
import user1 from '../assets/images/user1.jpg';
import user2 from '../assets/images/user2.jpg';
import user3 from '../assets/images/user3.jpg';

function Testimonials() {
  const testimonials = [
    {
      name: 'Kim Taeri',
      location: 'Seoul, South Korea',
      date: 'April 2023',
      review:
        'What a great experience using B Airways! I booked all of my flights for my gap year through B Airways and never had any issues. When I had to cancel a flight because of an emergency, B Airways support helped me out!',
      image: user1,
      rating: 5,
    },
    {
      name: 'Kaori Yamaguchi',
      location: 'Honolulu, Hawaii',
      date: 'February 2024',
      review:
        'My family and I visit Hawaii every year, and we usually book our flights through B Airways. B Airways was recommended to us by a long-time friend, and I\'m so glad we tried it out! The process was easy and reliable.',
      image: user2,
      rating: 4,
    },
    {
      name: 'Anthony Lewis',
      location: 'Berlin, Germany',
      date: 'May 2024',
      review:
        'When I was looking to book my flight to Berlin from Singapore, B Airways had the best browsing experience, so I figured I\'d give it a try. It was my first time using B Airways, but I\'d definitely recommend it to a friend and use it for more trips!',
      image: user3,
      rating: 5,
    },
  ];

  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleToggle = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section className="testimonials">
      <h2>What our users are saying</h2>
      <div className="testimonial-cards">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="testimonial-card">
            <Image 
              src={testimonial.image} 
              alt={testimonial.name} 
              className="testimonial-image" 
              width={100}
              height={100}
            />
            <div className="testimonial-info">
              <h3 className="testimonial-name">{testimonial.name}</h3>
              <p className="testimonial-location">
                {testimonial.location} | {testimonial.date}
              </p>
              <div className="testimonial-rating">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <span key={i} className="star">★</span>
                ))}
              </div>
              <p className={`testimonial-review ${expandedIndex === index ? 'expanded' : ''}`}>
                {testimonial.review}
              </p>
              <button onClick={() => handleToggle(index)} className="read-more-btn">
                {expandedIndex === index ? 'Read Less' : 'Read More'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Testimonials;

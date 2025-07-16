import React, { useState } from 'react';
import Question from './question';

const Quiz = ({questions}) => {
  return (
    <>
        {
            questions && Object.entries(questions).map(([key, q]) => (
                <Question question={q} id={`Q${key}`} key={key}/>
            ))
        }
    </>
  )
}

export default Quiz
import React, { useState } from 'react'

const Practice = () => {

    //state management for controlled component
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const value = e.target.value;
        setName(value);

        if (value.trim() === '') {
            setError('Name is required');
        } else if (value.length < 3) {
            setError('Name must be at least 3 characters');
        } else {
            setError('');
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim() === '') {
            setError('Name is required');
        } else if (name.length < 3) {
            setError('Name must be at least 3 characters');
        } else {
            setError('');
        }
        console.log(name);
    }

    return (
        <>
            <div className='container'>
                <div className='mt-4'>
                    <h1 className='text-center'>Learning Controlled Component</h1>
                    <form onSubmit={handleSubmit} action="">
                        <input type="text"
                            className='form-control'
                            placeholder='Enter your name'
                            value={name} // input value ta state diye controlled hocce mane react controll korteche 
                            onChange={handleChange}
                        />
                        {error && <p className='text-danger'>{error}</p>}
                        <div className='mt-3'>
                            <button type='submit' className='btn btn-secondary'>Submit</button>
                        </div>
                    </form>
                </div>
            </div>
            <hr />
            {/* <h2>Your name is typing: {name}</h2> */}

            {/* learning with controlled component for form input controlled by react state */}

        </>
    )
}

export default Practice

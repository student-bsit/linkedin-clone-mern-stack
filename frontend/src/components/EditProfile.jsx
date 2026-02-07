import React, { useContext, useRef, useState } from 'react'
import { RxCross1 } from "react-icons/rx";
import { userDataContext } from '../context/UserContext';
import dp from '../assets/dp.webp'
import { FaPlus, FaS } from "react-icons/fa6";
import { MdOutlineCameraAlt } from "react-icons/md";
import axios from 'axios';
import { authDataContext } from '../context/AuthContext';

const EditProfile = () => {
    let { edit, setEdit, userData, setUserData } = useContext(userDataContext);
    let { serverUrl } = useContext(authDataContext)

    let [firstName, setFirstName] = useState(userData ? `${userData.firstName}` : '')
    let [lastName, setLastName] = useState(userData ? `${userData.lastName}` : '')
    let [userName, setUserName] = useState(userData ? `${userData.userName}` : '')
    let [headline, setHeadline] = useState(userData ? `${userData.headline}` : '')
    let [location, setLocation] = useState(userData ? `${userData.location}` : '')

    let [Skills, setSkills] = useState(userData?.skills || []);
    let [newSkill, setNewSkill] = useState("");
    let [education, setEducation] = useState(userData?.education || []);

    let [newEducation, setNewEducation] = useState({
        college: "",
        degree: "",
        fieldOfstudy: ""
    });

    let [experience, setExperience] = useState(userData?.experience || []);
    let [newExperience, setNewExperience] = useState({
        title: "",
        company: "",
        description: ""
    });
    
    let [saving,setSaving]=useState(false)
    let [frontendProfileImage, setFrontendProfileImage] = useState(userData.profileImage || dp)
    let [backendProfileImage, setbackendProfileImage] = useState(null);
    let [frontendCoverImage, setFrontendCoverImage] = useState(userData.coverImage || null)
    let [backendCoverImage, setbackendCoverImage] = useState(null);

    const profileImage = useRef(null);
    const coverImage = useRef(null);

    function addSkill() {

        if (newSkill && !Skills.includes(newSkill)) {
            setSkills([...Skills, newSkill])

        }

        setNewSkill("");
    }

    function removeSkill(skill) {
        if (Skills.includes(skill)) {
            setSkills(Skills.filter((s) => s !== skill));
        }
    }

    function addEducation() {
        if (newEducation.college && newEducation.degree && newEducation.fieldOfstudy) {
            setEducation([...education, newEducation])

        }

        setNewEducation({
            college: "",
            degree: "",
            fieldOfstudy: ""
        })
    }

    function removeEducation(edu) {
        if (education.includes(edu)) {
            setEducation(education.filter((e) => e !== edu));
        }
    }

    function addExperince() {
        if (newExperience.title && newExperience.company && newExperience.description) {
            setExperience([...experience, newExperience])

        }

        setNewExperience({
            title: "",
            company: "",
            description: ""
        })
    }

    function removeExperience(exp) {
        if (experience.includes(exp)) {
            setExperience(experience.filter((e) => e !== exp));
        }
    }

    function handleProfile(e) {
        const file = e.target.files[0];
        if (!file) return;
        setbackendProfileImage(file);
        setFrontendProfileImage(URL.createObjectURL(file));
    }

    function handleCover(e) {
        const file = e.target.files[0];
        if (!file) return;
        setbackendCoverImage(file);
        setFrontendCoverImage(URL.createObjectURL(file));
    }

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            let formData = new FormData();
            formData.append("firstName", firstName)
            formData.append("lastName", lastName)
            formData.append("userName", userName)
            formData.append("headline", headline)
            formData.append("location", location)
            formData.append("skills", JSON.stringify(Skills))
            formData.append("education", JSON.stringify(education))
            formData.append("experience", JSON.stringify(experience))
            if (backendProfileImage) {
                console.log(backendProfileImage)
                formData.append("profileImage", backendProfileImage)
            }
            if (backendCoverImage) {
                console.log(backendCoverImage)
                formData.append("coverImage", backendCoverImage)
            }
            let result = await axios.put(serverUrl + "/api/user/updateProfile", formData, {
                withCredentials: true
            })
            console.log(result.data)
            setUserData(result.data)
            setSaving(false)
            setEdit(false)
        } catch (error) {
            console.log(error)
            setSaving(false)
        }
    }



    return (
        <div className='w-full h-[100vh] fixed top-0 z-[100] flex justify-center items-center'>

            <input type="file" accept='image/*' hidden ref={profileImage} onChange={handleProfile} />
            <input type="file" accept='image/*' hidden ref={coverImage} onChange={handleCover} />

            <div className='w-full h-full bg-black opacity-[0.5] absolute top-0 left-0'></div>

            <div className='w-[90%] max-w-[500px] h-[600px] bg-white overflow-auto relative z-[200] shadow-lg rounded-lg p-[10px]'>

                <div className='absolute top-[20px] right-[20px]  cursor-pointer' onClick={() => setEdit(false)}>
                    <RxCross1 className='w-[25px] h-[25px] text-gray-700 font-semibold' />
                </div>

                <div className='w-full h-[150px] bg-gray-500 overflow-hidden rounded-lg mt-[40px]' onClick={() => coverImage.current.click()}>
                    <img src={frontendCoverImage} alt="" className='w-full' />
                    <MdOutlineCameraAlt className='absolute top-[60px] right-[20px] text-white text-[25px] cursor-pointer' />
                </div>

                <div className='w-[80px] h-[80px] rounded-full absolute top-[150px] ml-[20px] cursor-pointer overflow-hidden' onClick={() => profileImage.current.click()} >
                    <img src={frontendProfileImage} alt="" />
                </div>

                <div className='w-[20px] h-[20px] bg-[#17c1ff] absolute top-[200px] left-[90px] rounded-full flex justify-center items-center'>
                    <FaPlus className='text-white ' />
                </div>

                <div className='w-full flex  flex-col justify-center items-center gap-[20px] mt-[50px]'>

                    <input type="text" placeholder='firstName' className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px]  text-[18px] border-2 rounded-lg' value={firstName} onChange={(e) => setFirstName(e.target.value)} />

                    <input type="text" placeholder='lastName' className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px]  text-[18px] border-2 rounded-lg' value={lastName} onChange={(e) => setLastName(e.target.value)} />

                    <input type="text" placeholder='userName' className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px]  text-[18px] border-2 rounded-lg' value={userName} onChange={(e) => setUserName(e.target.value)} />

                    <input type="text" placeholder='headline' className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px]  text-[18px] border-2 rounded-lg' value={headline} onChange={(e) => setHeadline(e.target.value)} />

                    <input type="text" placeholder='location' className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px]  text-[18px] border-2 rounded-lg' value={location} onChange={(e) => setLocation(e.target.value)} />

                    <input type="text" placeholder='gender (male/female/other' className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px]  text-[18px] border-2 rounded-lg' />

                    <div className='w-full p-[10px] border-2 border-gray-600 flex flex-col gap-[10px] rounded-lg'>
                        <h1 className='text-[19px] font-semibold'>Skills</h1>

                        {Skills && <div className='flex  flex-col gap-[10px]'>

                            {Skills.map((s, index) => {
                                return (
                                    <div key={index} className='w-full h-[40px] border-[1px] border-gray-600 bg-gray-200 rounded-lg p-[10px] flex justify-between items-center'>
                                        <span>{s}</span>
                                        <RxCross1 className='w-[20px] h-[20px] text-gray-800 font-bold cursor-pointer' onClick={() => removeSkill(s)} />
                                    </div>
                                )
                            })}

                        </div>}

                        <div className='flex flex-col gap-[10px] items-start'>
                            <input type="text" placeholder='add new skill' className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px]  text-[16px] border-2 rounded-lg' value={newSkill} onChange={(e) => setNewSkill(e.target.value)} />

                            <button className='w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff]' onClick={addSkill}>Add</button>

                        </div>

                    </div>

                    <div className='w-full p-[10px] border-2 border-gray-600 flex flex-col gap-[10px] rounded-lg'>
                        <h1 className='text-[19px] font-semibold'>Education</h1>

                        {education && <div className='flex  flex-col gap-[10px]'>

                            {education.map((edu, index) => {
                                return (
                                    <div key={index} className='w-full  border-[1px] border-gray-600 bg-gray-200 rounded-lg p-[10px] flex justify-between items-center'>
                                        <div>
                                            <div>
                                                college: {edu.college}
                                            </div>
                                            <div>
                                                degree: {edu.degree}
                                            </div>
                                            <div>
                                                fieldOfstudy: {edu.fieldOfstudy}
                                            </div>

                                        </div>
                                        <RxCross1 className='w-[20px] h-[20px] text-gray-800 font-bold cursor-pointer' onClick={() => removeEducation(edu)} />
                                    </div>
                                )
                            })}

                        </div>}

                        <div className='flex flex-col gap-[10px] items-start'>
                            <input type="text" placeholder='College' className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px]  text-[16px] border-2 rounded-lg' value={newEducation.college} onChange={(e) => setNewEducation({ ...newEducation, college: e.target.value })} />

                            <input type="text" placeholder='Degree' className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px]  text-[16px] border-2 rounded-lg' value={newEducation.degree} onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })} />

                            <input type="text" placeholder='FieldOfStudy' className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px]  text-[16px] border-2 rounded-lg' value={newEducation.fieldOfstudy} onChange={(e) => setNewEducation({ ...newEducation, fieldOfstudy: e.target.value })} />

                            <button className='w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff]' onClick={addEducation}>Add</button>

                        </div>

                    </div>

                    <div className='w-full p-[10px] border-2 border-gray-600 flex flex-col gap-[10px] rounded-lg'>
                        <h1 className='text-[19px] font-semibold'>Experience</h1>

                        {experience && <div className='flex  flex-col gap-[10px]'>

                            {experience.map((exp, index) => {
                                return (
                                    <div key={index} className='w-full  border-[1px] border-gray-600 bg-gray-200 rounded-lg p-[10px] flex justify-between items-center'>
                                        <div>
                                            <div>
                                                title: {exp.title}
                                            </div>
                                            <div>
                                                company: {exp.company}
                                            </div>
                                            <div>
                                                description: {exp.description}
                                            </div>

                                        </div>
                                        <RxCross1 className='w-[20px] h-[20px] text-gray-800 font-bold cursor-pointer' onClick={() => removeExperience(exp)} />
                                    </div>
                                )
                            })}

                        </div>}

                        <div className='flex flex-col gap-[10px] items-start'>
                            <input type="text" placeholder='title' className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px]  text-[16px] border-2 rounded-lg' value={newExperience.title} onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })} />

                            <input type="text" placeholder='company' className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px]  text-[16px] border-2 rounded-lg' value={newExperience.company} onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })} />

                            <input type="text" placeholder='description' className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px]  text-[16px] border-2 rounded-lg' value={newExperience.description} onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })} />

                            <button className='w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff]' onClick={addExperince}>Add</button>

                        </div>

                    </div>

                    <button className='w-full h-[50px] rounded-full bg-[#1dc9fd] mt-[40px] text-white' disabled={saving} onClick={() => handleSaveProfile()}>{saving?"Saving...":"Save Profile"}</button>

                </div>



            </div>

        </div>
    )
}

export default EditProfile

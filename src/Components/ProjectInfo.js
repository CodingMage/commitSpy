import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NotificationsActiveOutlinedIcon from '@material-ui/icons/NotificationsActiveOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import EditIcon from '@material-ui/icons/Edit';
import { IconButton } from '@material-ui/core';
import { Redirect } from "react-router-dom";
import Popup from 'reactjs-popup';
import { Twitter } from '@material-ui/icons';
import Loader from 'react-loader-spinner'
import CircularProgress from '@material-ui/core/CircularProgress';
import Chart from './Chart'


let output = {}

const ProjectInfo = ({ projects, onKen, token, location }) => {

    // STATES
    const [open, setOpen] = useState(false);
    const closeModal = () => setOpen(false);
    const [done, setDone] = useState(false)
    const [done2, setDone2] = useState(false)
    const [maxtime, setMaxtime] = useState('')
    const [mincommit, setMincommit] = useState('')
    const [alarm, setAlarm] = useState(0)
    const [billing, setBilling] = useState(false);
    const [test, setTest] = useState(false)
    const [tweet, setTweet] = useState(0)
    const [btnload, setBtnload] = useState(false)

    const [proj, setProj] = useState({})
    const { roomId } = useParams();
    useEffect(() => {
        const axios = require('axios');


        axios.get(`https://commitspy.herokuapp.com/api/project/projects/${roomId}`, {
            headers: { 'authorization': `Bearer ${token}` }
        }).then(function (response) {
            // console.log(response);
            setProj(response.data)
            setDone(true)




        }).catch(err => {
            console.log(err);
        })


    },
        // eslint-disable-next-line  
        [test, roomId,])


    const deleteProject = () => {
        if (window.confirm('are you sure you want to delete')) {

            const axios = require('axios');
            axios.delete(`https://commitspy.herokuapp.com/api/project/projects/${proj._id}`, {
                headers: { 'authorization': `Bearer ${token}` }
            }).then(function (response) {
                console.log(response);
                onKen(response)
                setDone2(true)


            }).catch(err => {
                console.log(err);
            })
        }
    }



    if (done2) {
        return <Redirect to='/home' />
    }
    //geteditvalue
    let realtime = Math.floor((maxtime * 1000) * (86400))
    let realalarm = Number(alarm)
    let realbilling = Boolean(Number(billing))

    const getEdit = () => {
        setBtnload(true)

        let project = {
            _id: roomId,
            maxTime: realtime,
            setMinCommit: Number(mincommit),
            alarmType: realalarm,
            billing: realbilling
        }
        const axios = require('axios');
        axios.put(`https://commitspy.herokuapp.com/api/project/`, { project }, {
            headers: { 'authorization': `Bearer ${token}` },

        }).then(function (response) {
            console.log(response);
            setTweet(realalarm)

            setTest(o => !o)
            setBtnload(false)
            closeModal()



        }).catch(function (error) {
            console.log(error);
        });
    }
    if (done) {
        function extractCommits(dump, prev) {
            let total = 0;
            let list = dump.filter(commit => {

                commit.date = new Date(commit.date)
                let output = commit.date >= prev && commit.date < Date.now();
                return output

            });
            console.log("list > ", list)
            for (let i = 0; i < list.length; i++) {
                total += list[i].numberOfCommit
            }
            return total;
        }

        function getCurrentCommits(project) {
            let trigger = new Date(project.trigger);
            let total = 0;
            let endTrigger = project.trigger;
            if (trigger.getTime() - project.maxTime > Date.now()) {
                //means that he has finished and completed his goals
                let prev = new Date(trigger.getTime() - (2 * project.maxTime));
                total = extractCommits(project.rawCommits, prev);
                endTrigger = trigger.getTime() - project.maxTime;
            } else {
                let prev = new Date(trigger.getTime() - (project.maxTime));
                total = extractCommits(project.rawCommits, prev);
            }
            return { total, trigger: endTrigger };
        }


        output = getCurrentCommits(proj)

    }
    let date = new Date(output.trigger);
    let deadline = date.toDateString()


    if (done) {

        return (
            <div className='projectinfo'>
                <div className="top">
                    <h1 className='name'>{proj.title.split('/')[1]}</h1>
                    <IconButton onClick={deleteProject}>
                        <DeleteOutlineOutlinedIcon />

                    </IconButton>

                </div>

                <div className="settings">
                    <div className="settings__top">

                        <h1>Settings</h1>
                        <IconButton onClick={() => setOpen(o => !o)}>

                            <EditIcon />
                        </IconButton>
                    </div>
                    <div className="overnotification">
                        <div className="notification">
                            <NotificationsActiveOutlinedIcon />
                            <h3>Deadline:</h3>
                            <h3 className='date'>{deadline}</h3>
                        </div>

                        {/* <div class="frac">
                            <span>{output.total}</span>
                            <span class="symbol">/</span>
                            <span class="bottom">{proj.setMinCommit}</span>

                        </div> */}


                    </div>
                    <div className="over">
                        <h3>{output.total} Out of {proj.setMinCommit} commits </h3>


                    </div>

                    <div className="settings_info alarm">
                        <h3>Alarm Type</h3>
                        <div>
                            <MailOutlineIcon className='msg' />
                            <Twitter className={tweet === 1 ? 'show' : 'tweet'} />
                        </div>

                    </div>
                </div>
                <Popup open={open} closeOnDocumentClick onClose={closeModal}  >
                    <div className='edit_pop'>
                        <div className='maxmin'>
                            <h3>Maxtime</h3>
                            <input type="text" placeholder="Enter Deadline" value={maxtime} onChange={e => setMaxtime(e.target.value)} />
                        </div>
                        <div className='maxmin'>
                            <h3>Set Min commit</h3>
                            <input type="text" placeholder="Enter your min commit" value={mincommit} onChange={e => setMincommit(e.target.value)} />
                        </div>
                        <div className='alabill'>
                            <h3>Alarm Type</h3>
                            <select name="alarm" id="alarm" value={alarm} onChange={(e) => setAlarm(e.target.value)}>
                                <option value="0">Email only</option>
                                <option value="1">Email and Twitter</option>
                            </select>


                        </div>
                        <div className='alabill'>
                            <h3>Billing</h3>
                            <select name="billing" id="billing" value={billing} onChange={(e) => setBilling(e.target.value)}>
                                <option value='0' >No</option>
                                <option value='1'>Yes</option>
                            </select>
                        </div>

                        <button onClick={getEdit}>Submit {btnload && <CircularProgress />}</button>
                        <button onClick={closeModal}>Cancle</button>


                    </div>

                </Popup>

                <Chart weeklyCommits={proj.weeklyCommits} />
            </div>
        );
    } else {
        return (
            <div className="loading">

                <Loader type="Rings" color="#354376" height={130} width={130} />
            </div>

        )
    }
};

export default ProjectInfo;
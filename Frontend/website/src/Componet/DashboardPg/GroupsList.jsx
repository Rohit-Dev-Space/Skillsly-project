import React, { useContext, useEffect, useState } from 'react';
import { ArrowLeftRight, Edit, LogOut, Save, Trash2, X } from 'lucide-react';
import axiosinstance from '../../Utilities/axiosIntance';
import { UserContext } from '../Context/UserContext';
import Modal from '../../Utilities/Modal';
import { useNavigate } from 'react-router-dom';

const GroupsList = () => {

  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [groupId, setGroupId] = useState(null);
  const [title, setTitle] = useState('');
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const handleGetGroups = async () => {
    try {
      const response = await axiosinstance.get('/groups/get-groups');
      setGroups(response.data.data);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const handleEdit = (item) => {
    if (user._id === item.createdBy._id) {
      setSelectedGroupId(item._id);
      setEditedTitle(item.title);
    } else {
      return;
    }
  }

  const handleSaveTitle = async (item) => {
    const response = await axiosinstance.put('/groups/change-title', { id: item._id, title: editedTitle });
    if (response.data) {
      setSelectedGroupId('');
      handleGetGroups();
    } else {
      console.log('Error updating title');
    }
  }

  const handleGroupModal = (item, title) => {
    setTitle(title);
    setIsOpen(true);
    setGroupId(item._id);
  }

  const handleDeleteGroup = async (id) => {
    const response = await axiosinstance.delete(`/groups/delete-group/${id}`);
    if (response.data) {
      handleGetGroups();
      setIsOpen(false);
    } else {
      console.log('Error deleting group');
    }
  }

  const handleLeaveGroup = async (id) => {
    const response = await axiosinstance.put(`/groups/leave-group/${id}`);
    if (response.data) {
      handleGetGroups();
      setIsOpen(false);
    } else {
      console.log('Error deleting group');
    }
  }

  const handleNavigation = (item) => {
    navigate(`/dashboard/groups/${item.title}/${item._id}`);
  }

  useEffect(() => {
    handleGetGroups();
  }, []);

  return (
    <>
      <div className="p-6 md:p-10 w-full h-full">
        <h1 className="text-3xl md:text-4xl font-light text-white mb-8">Groups</h1>
        <div className="space-y-4">
          {groups.map((Item, index) => (
            <div className="flex items-center justify-between bg-black p-4 md:p-6 rounded-xl shadow-lg border border-[#1a1a1a]" key={index}>
              <div className='cursor-pointer flex justify-between w-6/7' onClick={() => handleNavigation(Item)}>
                <div className='flex flex-col gap-2'>
                  <p className='text-sm text-gray-500 font-light'>Group Title</p>
                  {selectedGroupId === Item._id ? <input type="text" onClick={(e) => e.stopPropagation()} onChange={(e) => { setEditedTitle(e.target.value) }} value={editedTitle} className="bg-[#111] text-white px-3 py-2 rounded-lg outline-none w-full" /> :
                    <p className="text-white text-base md:text-lg font-medium">{Item.title}</p>}
                </div>
                <div>
                  <p className='text-sm text-gray-400'>Created by : {Item.createdBy.userName}</p>
                  <p className='text-sm text-gray-400 flex gap-2 items-center text-center mt-2'>Skills : {Item.memberOneSkill}<ArrowLeftRight size={15} />{Item.memberTwoSkill}</p>
                </div>
              </div>
              <div className="flex space-x-3 text-gray-400">
                {selectedGroupId !== Item._id ?
                  (
                    <>
                      {Item.createdBy.userName === user?.userName && <button onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(Item)
                      }} className="p-2 cursor-pointer rounded-full hover:bg-[#1a1a1a] hover:text-teal-400 transition-colors">
                        <Edit className="w-5 h-5" />
                      </button>}
                      <button onClick={() => { { Item.groupMembers.length >= 2 ? handleGroupModal(Item, 'Leave Group') : handleGroupModal(Item, 'Delete Group') } }} className="p-2 rounded-full  cursor-pointer hover:bg-[#1a1a1a] hover:text-red-500 transition-colors">
                        {Item.groupMembers.length >= 2 ? <LogOut className="w-5 h-5" /> : <Trash2 className="w-5 h-5" />}
                      </button>
                    </>

                  ) : (
                    <>
                      <button onClick={(e) => {
                        e.stopPropagation();
                        handleSaveTitle(Item)
                      }} className="p-2 cursor-pointer rounded-full hover:bg-[#1a1a1a] hover:text-teal-400 transition-colors">
                        <Save className="w-5 h-5" />
                      </button>
                      <button onClick={(e) => {
                        e.stopPropagation();
                        setSelectedGroupId(null)
                      }} className="p-2 rounded-full hover:bg-[#1a1a1a] hover:text-red-500 transition-colors">
                        <X className="w-5 h-5" />
                      </button>
                    </>
                  )
                }
              </div>
            </div>
          ))}
        </div>
        {isOpen && (
          <Modal
            title={title}
            isClose={() => setIsOpen(false)}
            className={'absolute w-full h-full'}
          >
            <div className="text-center w-full h-fit p-5 mx-3">{`Are you sure you want to ${title}?`}</div>
            <div className="w-full h-fit flex items-center justify-center gap-5 p-10">
              <button onClick={() => setIsOpen(false)} className="w-fit h-fit px-7 cursor-pointer py-3 bg-white text-black rounded-xl">Cancel</button>
              <button onClick={() => { title === 'Delete Group' ? handleDeleteGroup(groupId) : handleLeaveGroup(groupId) }} className="w-fit h-fit px-7 cursor-pointer py-3 bg-red-400 text-white rounded-xl">{title}</button>
            </div>
          </Modal>
        )}
      </div>
    </>
  )
}


export default GroupsList;
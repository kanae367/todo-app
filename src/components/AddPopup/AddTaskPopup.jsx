import '../TaskPopup/taskPopup.scss';
import '../EditPopup/edit-popup.scss';
import Select from '../Select/Select';
import { useContext } from 'react';
import { FormProvider } from 'react-hook-form';
import DataContext from '../../context/context';
import InputListItemEditable from '../InputListItem/InputListItemEditable';
import { useCustomForm } from '../../useCustomForm';
import { addDocToDatabase } from '../../services';

const AddTaskPopup = ({setIsAdding}) => {
    const {currentBoard} = useContext(DataContext);
    const placeholders = [{placeholder: 'e.g. Make coffee'}, {placeholder: 'e.g. Drink coffee & smile'}];
    const {methods, append, remove, isFeildsCreationComplete, fields} = useCustomForm(placeholders);

    const handleSubtaskAdd = () => {
        append({placeholder: 'new subtask'}, {shouldFocus: false});
    }

    const handleTaskSubmit = (data) => {
        const subtasks = data.elements.map(item => {
            return {
                name: item.name,
                iscompleted: false
            }
        })

        const newTask = {
            name: data.name,
            description: data.description,
            status: data.status,
            subtasks,
            timestamp: new Date().getTime()
        }

        addDocToDatabase(`boards/${currentBoard.id}/tasks`, newTask);
        setIsAdding(false);
    }

    const handlePopupExit = (e) => {
        if(!e.target.classList.contains('popup')) return;
        setIsAdding(false);
    }

    const subtasksElements = 
        fields.map((subtask, index) => 
            <InputListItemEditable 
                key={subtask.id} 
                element={subtask} 
                index={index} 
                handleInputDelete={remove}/>
            );

    return (
        <div className={`popup ${isFeildsCreationComplete ? 'popup_active' : ''}`} onClick={handlePopupExit}>
            <FormProvider {...methods}>
                <form className="popup__card" onSubmit={methods.handleSubmit(handleTaskSubmit)}>
                    <h3 className='popup__title'>Add Task</h3>
                    <div className='popup__input'>
                        <label htmlFor="title" className='text-m'>Title</label>
                        <input className='popup__input-field' id='title' type="text" {...methods.register('name')} required maxLength={50} placeholder='e.g. Take coffee break'/>
                    </div>
                    <div className='popup__input'>
                        <label htmlFor="description" className='text-m'>Description</label>
                        <textarea className='popup__input-field' id='description' {...methods.register('description')} type="text" maxLength={200} placeholder='e.g. It’s always good to take a break. This 15 minute break will recharge the batteries a little.'/>
                    </div>
                    <div className='popup__input'>
                        <p className='text-m'>Subtasks</p>
                        <div className='card__subtasks'>
                            {subtasksElements}
                        </div>
                        <button type='button' className='popup__btn' onClick={handleSubtaskAdd}>+ Add New Subtask</button>
                    </div>
                    <div className='popup__input'>
                        <p className='text-m'>Status</p>
                        <Select/>
                    </div>
                    <button type='submit' className='popup__btn submit-btn'>Add Task</button>
                </form>
            </FormProvider>
        </div>
    )
}

export default AddTaskPopup;
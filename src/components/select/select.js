import { useContext } from "react";
import dataContext from '../../context';

const Select = () => {
    const {state} = useContext(dataContext);
    const {data, currentBoard, shownTask} = state;
    let currentColumn = null;
    data.boards[currentBoard].columns.forEach((item, index) => {
        item.tasks.forEach(item => {
            if(item.title === shownTask.title){
                currentColumn = index;
            }
        })
    });

    const options = data.boards[currentBoard].columns.map((item, index) => {
        return(
            <option defaultValue={item.name} key={index}>{item.name}</option>
        )
    })

    return(
        <select className='card__status-select' name="column" defaultValue={data.boards[currentBoard].columns[currentColumn].name}>
            {options}
        </select>
    )
}

export default Select;
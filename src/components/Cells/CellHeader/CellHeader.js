import './cellHeader.scss'


const CellHeader = ({nameDay, numDay, nameMonth}) => {
    return (
        <div className="cell-header">
            <span>{nameDay}</span>
            <span>{nameMonth}</span>
            <span>{numDay}</span>
        </div>
    )
}

export default CellHeader;

import './cellSide.scss'


const CellSide = ({children, id}) => {
    return (
        <div className="cell-side" id={id ? id : undefined}>
           {children}
        </div>
    )
}

export default CellSide;

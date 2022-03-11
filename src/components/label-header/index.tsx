import style from './label-header.module.css';

const LabelHeader = (props: any) => {
    const { label } = props;
    return (
        <div className={style.label}>
            {label}
        </div>
    )
};

export default LabelHeader;
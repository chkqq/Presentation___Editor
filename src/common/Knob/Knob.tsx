import { connect } from 'react-redux';
import styles from './Knob.module.css';
import { Editor } from '../../model/types';

interface KnobProps {
    isDarkTheme: boolean,
    value: number,
    step: number,
    onClick: (value: number) => void
}

const Knob = ({
    isDarkTheme,
    value,
    step,
    onClick
}: KnobProps) => {
    return (
        <table className = {[`${styles.table}`, isDarkTheme ? styles.table_light_theme : styles.table_dark_theme].join(' ')}>
            <thead className={styles.table_head}>
                <tr className={styles.row}>
                    <td
                        className={isDarkTheme ? styles.minus_light_theme : styles.minus_dark_theme}
                        onClick={() => {
                            if (value - step > 0) {
                                value -= step
                            }
                            onClick(value)
                        }}
                    ></td>
                    <td className={[`${styles.value}`, isDarkTheme ? styles.value_light_theme : styles.value_dark_theme].join(' ')}>{value}</td>
                    <td
                        className={isDarkTheme ? styles.plus_light_theme : styles.plus_dark_theme}
                        onClick={() => {
                            if (value + step <= 900) {
                                value += step
                            }
                            onClick(value)
                        }}
                    ></td>
                </tr>
            </thead>
        </table>
    )
}

function mapStateToProps(state: Editor) {
    return {
        isDarkTheme: state.isDarkTheme,
    }
}

export default connect(mapStateToProps)(Knob)
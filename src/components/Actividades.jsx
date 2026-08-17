export const Actividades = ({ actividades = [] }) => (
    <div className="destination-activities">
        {actividades.map((actividad, index) => (
            <span key={`${actividad}-${index}`}>{actividad}</span>
        ))}
    </div>
)

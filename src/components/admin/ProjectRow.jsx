// Request a small Cloudinary-transformed thumbnail instead of downloading
// the full-size (e.g. 800px) image just to shrink it to 50px in the DOM.
function cloudinaryThumb(url, size = 100) {
  if (!url || !url.includes("cloudinary.com")) return url;
  return url.replace('/upload/', `/upload/w_${size},h_${size},c_fill,q_auto/`);
}

export default function ProjectRow({ project, onEdit, onDelete }) {
  return (
    <div className="admin-project-row">
      <img src={cloudinaryThumb(project.imageURL, 100)} alt={project.title} width="50" />
      <div>
        <h3>{project.title}</h3>
        {/* FIX: guard against techStack being missing/non-array */}
        <p>{(project.techStack || []).join(", ")}</p>
      </div>
      <div className="admin-actions">
        <button onClick={() => onEdit(project)}>Edit</button>
        <button className="danger" onClick={() => onDelete(project._id)}>Delete</button>
      </div>
    </div>
  );
}
function cloudinaryThumb(url, size = 100) {
  if (!url || !url.includes("cloudinary.com")) return url;
  return url.replace(
    "/upload/",
    `/upload/w_${size},h_${size},c_fill,q_auto,f_auto/`
  );
}

export default function ProjectRow({ project, onEdit, onDelete }) {
  const thumb = cloudinaryThumb(project.imageURL, 100);

  return (
    <div className="admin-project-row">
      <img
        src={thumb}
        alt={project.title}
        width="50"
        height="50"
        loading="lazy"
        decoding="async"
        style={{
          objectFit: "cover",
          borderRadius: "8px",
          flexShrink: 0,
        }}
      />

      <div>
        <h3>{project.title}</h3>
        <p>{(project.techStack || []).join(", ")}</p>
      </div>

      <div className="admin-actions">
        <button onClick={() => onEdit(project)}>Edit</button>
        <button className="danger" onClick={() => onDelete(project._id)}>
          Delete
        </button>
      </div>
    </div>
  );
}
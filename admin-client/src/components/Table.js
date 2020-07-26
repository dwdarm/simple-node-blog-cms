import React from 'react';

const Table = ({ data, onEdit, onDelete }) => (
  <table className="table is-striped is-fullwidth">
    <thead>
      <tr>
        <th>ID</th>
        <th>Title</th>
        <th>Slug</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {data.map(e => (
        <tr key={e.id}>
          <td>{e.id}</td>
          <td>{e.title}</td>
          <td>{e.slug}</td>
          <td>
            <a 
              className="has-text-success" 
              style={{marginRight: '1rem'}}
              onClick={(ev) => {
                ev.preventDefault();
                if (onEdit) { onEdit(e) }
              }}>
              Edit
            </a>
            <a 
              className="has-text-danger"
              onClick={(ev) => {
                ev.preventDefault();
                if (onDelete) { onDelete(e) }
              }}>
              Delete
            </a><
          /td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default Table;

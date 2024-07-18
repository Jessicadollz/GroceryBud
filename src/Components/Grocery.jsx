import React, { useState, useEffect, useRef } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Grocery.css';

function Grocery() {
  const getLocalStorage = () => {
    let list = localStorage.getItem('list');
    return list ? JSON.parse(list) : [];
  };

  const [alert, setAlert] = useState({ show: false, msg: '', type: '' });
  const [grocery, setGrocery] = useState('');
  const [items, setItems] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditID] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('list', JSON.stringify(items));
  }, [items]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!grocery) {
      showAlert(true, 'danger', 'Please enter value');
    } else if (grocery && isEditing) {
      setItems(items.map((item) => {
        if (item.id === editID) {
          return { ...item, title: grocery };
        }
        return item;
      }));
      setGrocery('');
      setEditID(null);
      setIsEditing(false);
      showAlert(true, 'success', 'Value Changed');
    } else {
      showAlert(true, 'success', 'Item added to the list');
      const newItem = { id: new Date().getTime().toString(), title: grocery };
      setItems([...items, newItem]);
      setGrocery('');
    }
  };

  const showAlert = (show = false, type = '', msg = '') => {
    setAlert({ show, type, msg });
  };

  const clearItems = () => {
    showAlert(true, 'danger', 'Empty list');
    setItems([]);
  };

  const removeItem = (id) => {
    showAlert(true, 'danger', 'Item removed');
    setItems(items.filter((item) => item.id !== id));
  };

  const editItem = (id) => {
    const specificItem = items.find((item) => item.id === id);
    setIsEditing(true);
    setEditID(id);
    setGrocery(specificItem.title);
    inputRef.current.focus();
  };

  return (
    <section className="section-center">
      <form className="grocery-form" onSubmit={handleSubmit}>
        {alert.show && <p className={`alert alert-${alert.type}`}>{alert.msg}</p>}
        <h1>Grocery Bud</h1>
        <div className="form-control">
          <input
            type="text"
            id="grocery"
            ref={inputRef}
            value={grocery}
            onChange={(e) => setGrocery(e.target.value)}
            placeholder="e.g. eggs"
          />
          <button type="submit" className="submit-btn">
            {isEditing ? 'Edit' : 'Submit'}
          </button>
        </div>
      </form>
      {items.length > 0 && (
        <div className="grocery-container">
          <div className="grocery-list">
            {items.map((item) => {
              const { id, title } = item;
              return (
                <article className="grocery-item" key={id}>
                  <p className="title">{title}</p>
                  <div className="btn-container">
                    <button
                      type="button"
                      className="edit-btn"
                      onClick={() => editItem(id)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => removeItem(id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
          <button className="clear-btn" onClick={clearItems}>
            Clear Items
          </button>
        </div>
      )}
    </section>
  );
}

export default Grocery;

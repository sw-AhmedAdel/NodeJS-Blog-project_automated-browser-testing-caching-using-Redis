import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchBlog } from '../../redux/actions';

const BlogShow = ({ blogs, fetchBlog }) => {
  const { _id } = useParams();
  const { title, content } = blogs[_id];
  
  useEffect(() => {
    fetchBlog(_id);
  }, [fetchBlog, _id])
  
  return (
    blogs[_id] &&
      <div>
        <h3>{title}</h3>
        <p>{content}</p>
      </div>
  );
}

function mapStateToProps({ blogs }, ownProps) {
  return { blogs };
}

export default connect(mapStateToProps, { fetchBlog })(BlogShow);

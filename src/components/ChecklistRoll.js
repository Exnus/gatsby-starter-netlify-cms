import React, { useEffect, useState } from 'react';
import {Link, graphql, StaticQuery} from 'gatsby';

import SEO from '../components/seo';
import { getPersistedAnswer } from '../utils/persistAnswers';
import { filterPosts } from '../utils/filterPosts';
import PropTypes from "prop-types";
//import 'semantic-ui-css/semantic.css';
//import './index.css';

const ChecklistRoll = props => {
  const { data } = props;
  const siteTitle = data.site.siteMetadata.title;
  const posts = data.allMarkdownRemark.edges;

  useEffect(() => {
    document.body.style.backgroundImage = null;
  }, []);

  const [visiblePosts, setVisiblePosts] = useState(posts);

  const handleFilter = (e) => {
    const filterValue = e.target.value;
    const filteredPosts = filterPosts(posts, filterValue);
    setVisiblePosts(filteredPosts);
  }

  return (
    <div className="columns is-multiline">
      <SEO title="All questions" />
      <div>
        <label htmlFor="filter-questions">Filter: </label>
        <select onChange={handleFilter} id="filter-questions">
          <option>All</option>
          <option>Correct</option>
          <option>Incorrect</option>
          <option>Completed</option>
          <option>Incomplete</option>
        </select>
      </div>
      <ul className="list">
        {visiblePosts.map(({ node }) => {
          const title =
            node.frontmatter.title || node.fields.slug;
          const {
            selectedAnswer,
            correctAnswer
          } = getPersistedAnswer(title);
          let correctIndicator;
          if (selectedAnswer !== null) {
            correctIndicator =
              correctAnswer === selectedAnswer ? (
                <span style={{ color: 'green' }}>
                  <i className="check circle icon"></i>
                </span>
              ) : (
                <span style={{ color: 'red' }}>
                    <i className="times circle icon"></i>
                  </span>
              );
          } else {
            correctIndicator = (
              <span style={{ color: 'gray' }}>
                <i className="outline circle icon"></i>
              </span>
            )
          }
          return (
            <li key={node.fields.slug}>
              <article>
                <header>
                  {correctIndicator}{' '}
                  <Link
                    style={{ boxShadow: `none` }}
                    to={node.fields.slug}
                  >
                    {title}
                  </Link>
                </header>
              </article>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

ChecklistRoll.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
}

export default () => (
  <StaticQuery
    query={graphql`
      query {
        site {
          siteMetadata {
            title
          }
        }
        allMarkdownRemark(
          sort: { fields: [frontmatter___order], order: ASC }
        ) {
          edges {
            node {
              excerpt
              fields {
                slug
              }
              frontmatter {
                title
                date
              }
            }
          }
        }
      }
    `}
    render={(data, count) => <ChecklistRoll data={data} count={count} />}
  />
)

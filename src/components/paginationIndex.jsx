import React, { useState } from "react";

import Pagination from "react-bootstrap/Pagination";

function PaginationIndex(props) {
  function paginateChange(e) {
    setShow(e);

    props.getUpdatePaginate(e);
  }
  const [selected_page, setShow] = useState(1);

  var total_pages = props.total_pages;
  var loopobj = [];

  for (var i = total_pages; i > 0; i--) {
    loopobj.push(i);
  }

  return (
    <Pagination>
      <Pagination.First />
      <Pagination.Prev />

      {loopobj.map((item, idx) => (
        <Pagination.Item
          active={parseInt(selected_page) === idx + 1}
          onClick={() => paginateChange(idx + 1)}
        >
          {idx + 1}
        </Pagination.Item>
      ))}

      <Pagination.Next />
      <Pagination.Last />
    </Pagination>
  );
}

export default React.memo(PaginationIndex);

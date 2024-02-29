import React, { useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { Form, useLoaderData ,useFetcher} from "react-router-dom";
import { getContact,updateContact } from "../contacts";

export async function action({ request, params }) {
    let formData = await request.formData();
    return updateContact(params.contactId, {
      favorite: formData.get("favorite") === "true",
    });
  }

  function Favorite({ isFavorite }) {
    const fetcher = useFetcher();
    const [favorite, setFavorite] = useState(isFavorite);
    if (fetcher.formData) {
        isFavorite = fetcher.formData.get("favorite") === "true";
      }
  
    const toggleFavorite = () => {
      setFavorite(!favorite);
    };
  
    return (
       <fetcher.Form method='post'>
      <button
        type="button"
        onClick={toggleFavorite}
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
      >
        {favorite ? "★" : "☆"}
      </button>
      </fetcher.Form>
    );
  }
  
  Favorite.propTypes = {
    isFavorite: PropTypes.bool.isRequired,
  };

  export async function loader({ params }) {
    const contact = await getContact(params.contactId);
    if (!contact) {
      throw new Response("", {
        status: 404,
        statusText: "Not Found",
      });
    }
    return { contact };
  }

export default function Contact() {
   
//   const contact = {
//     first: "Your",
//     last: "Name",
//     avatar: "https://placekitten.com/g/200/200",
//     twitter: "your_handle",
//     notes: "Some notes",
//     favorite: true,
//   };
  const { contact } = useLoaderData();

  return (
    <div id="contact">
      <div>
        <img src={contact.avatar} alt="Contact" />
      </div>
      <div>
        <h1>
          {contact.first || contact.last ? `${contact.first} ${contact.last}` : <i>No Name</i>}
          <Favorite isFavorite={contact.favorite} />
        </h1>
        {contact.twitter && (
          <p>
            <a
              target="_blank"
              rel="noopener noreferrer"
                  href={`https://twitter.com/${contact.twitter}`}
                // href={`https://twitter.com/your_handle`}

              >
              @{contact.twitter}
            </a>
          </p>
        )}
        {contact.notes && <p>{contact.notes}</p>}
        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
                if (
                  !confirm(
                    "Please confirm you want to delete this record."
                  )
                ) {
                  event.preventDefault();
                }
              }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

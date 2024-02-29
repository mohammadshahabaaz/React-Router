import { Link, Outlet,useLoaderData ,Form,  redirect,NavLink,useNavigation
} from "react-router-dom";
import { getContacts,createContact } from "../contacts";
import { useEffect} from "react";
import {
    // existing code
    useSubmit,
  } from "react-router-dom";

export async function loader({ request }) {
    const url = new URL(request.url);
    const q = url.searchParams.get("q");
    const contacts = await getContacts(q);
    return { contacts,q };
  }
  export async function action() {
    const contact = await createContact();
    return redirect(`/contacts/${contact.id}/edit`);
    // return { contact };
  }

export default function Root() {
    const { contacts,q } = useLoaderData();
    const navigation = useNavigation();
    const submit = useSubmit();
    const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has(
      "q"
    );
    useEffect(() => {
        document.getElementById("q").value = q;
      }, [q]);
    return (
      <>
        <div id="sidebar">
          <h1>React Router Contacts</h1>
          <div>
            <Form id="search-form" role="search">
              <input
                id="q"
                className={searching ? "loading" : ""}
                aria-label="Search contacts"
                placeholder="Search"
                type="search"
                name="q"
                defaultValue={q}
                onChange={(event) => {
                    const isFirstSearch = q == null;
                submit(event.currentTarget.form, {
                  replace: !isFirstSearch,
                });
                  }}
              />
              <div
                id="search-spinner"
                aria-hidden
                hidden={!searching}
              />
              <div
                className="sr-only"
                aria-live="polite"
              ></div>
            </Form>
            <Form method="post">
              <button type="submit">New</button>
            </Form>
          </div>
          
          <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <NavLink to={`contacts/${contact.id}`}>
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    {contact.favorite && <span>★</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>

        <nav>
            <ul>
              <li>
                {/* <a href={`/contacts/1`}>Your Name</a> */}
                <Link to={`contacts/1`}>Your Name</Link>
              </li>
              <li>
                {/* <a href={`/contacts/2`}>Your Friend</a> */}
                <Link to={`contacts/2`}>Your Friend</Link>
              </li>
            </ul>
          </nav>
        </div>
        <div id="detail" className={
          navigation.state === "loading" ? "loading" : ""
        }>
        <Outlet />
        </div>
      </>
    );
  }
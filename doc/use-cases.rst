Use Cases
=========

Common Alternate Flows
----------------------
There are several alternate flows that can occur in nearly every standard use
case.  They are outlined here and should be considered viable possibilities at
any stage of operation. 

Server Unreachable
^^^^^^^^^^^^^^^^^^
+---------------------+----------------------------------------------------------+
| **Description**     | Server name lookup failed.                               |
+---------------------+----------------------------------------------------------+
| **Actors**          | User                                                     |
+---------------------+----------------------------------------------------------+
| **Pre-Conditions**  | Any action that needs to contact server has been         |
|                     | initiated.                                               |
+---------------------+----------------------------------------------------------+
| **Post-Conditions** | System returned to state before failed action occurred.  |
+---------------------+----------------------------------------------------------+
| **Basic Flow**      | 1. System informs user that server could not be reached. |
|                     | 2. System suggests that user check to see that they are  |
|                     |    connected to the internet.                            |
|                     | 3. System returns to state before request initiated.     |
+---------------------+----------------------------------------------------------+

Server Timeout
^^^^^^^^^^^^^^
+---------------------+----------------------------------------------------------+
| **Description**     | Server could not respond in a timely fashion.            |
+---------------------+----------------------------------------------------------+
| **Actors**          | User                                                     |
+---------------------+----------------------------------------------------------+
| **Pre-Conditions**  | Any action that needs to contact server has been         |
|                     | initiated.                                               |
+---------------------+----------------------------------------------------------+
| **Post-Conditions** | System returned to state before failed action occurred.  |
+---------------------+----------------------------------------------------------+
| **Basic Flow**      | 1. System informs user that it cannot reach the server.  |
|                     | 2. System kindly requests that user try the action again |
|                     |    later.                                                |
|                     | 3. System returns to state before request initiated.     |
+---------------------+----------------------------------------------------------+

Use Case Flows
--------------
Any use case flows below that deal with editing or formatting text in a specific
way are features unique to WYMeditor. They are not necessarily features that
PolicyPad itself provides, but they will be present if PolicyPad is used with
the preferred editor, WYMeditor.

Creating a New Document
^^^^^^^^^^^^^^^^^^^^^^^
+---------------------+----------------------------------------------------------+
| **Description**     | User creates a new document.                             |
+---------------------+----------------------------------------------------------+
| **Actors**          | User                                                     |
+---------------------+----------------------------------------------------------+
| **Pre-Conditions**  | Must have a web browser and network connection.          |
+---------------------+----------------------------------------------------------+
| **Post-Conditions** | User's browser is currently displaying new document.     |
+---------------------+----------------------------------------------------------+
| **Basic Flow**      | 1. User initiates creating a new document.               |
|                     | 2. The system generates a new document with a unique URL.|
|                     | 3. The system redirects the user to the new URL.         |
+---------------------+----------------------------------------------------------+
| **Alternate Flow**  | None                                                     |
+---------------------+----------------------------------------------------------+

View Prior Change
^^^^^^^^^^^^^^^^^
+---------------------+----------------------------------------------------------+
| **Description**     | Ability to view any prior change made to a document.     |
+---------------------+----------------------------------------------------------+
| **Actors**          | User                                                     |
+---------------------+----------------------------------------------------------+
| **Pre-Conditions**  | Document must exist and be currently open.               |
+---------------------+----------------------------------------------------------+
| **Post-Conditions** | User's browser displays prior changes made, if any.      |
+---------------------+----------------------------------------------------------+
| **Basic Flow**      | 1. User clicks on button in interface.                   |
|                     | 2. Opens a new window containing a revisions. [Alt. Flow]|
+---------------------+----------------------------------------------------------+
| **Alternate Flow**  | 1. No prior changes exist.                               |
|                     | 2. System returns to state before user click.            |
+---------------------+----------------------------------------------------------+

Bad URL
^^^^^^^
+---------------------+----------------------------------------------------------+
| **Description**     | User enters URL that doesn't exist as a document, i.e.   |
|                     | invalid obfuscated URL.                                  |
+---------------------+----------------------------------------------------------+
| **Actors**          | User                                                     |
+---------------------+----------------------------------------------------------+
| **Pre-Conditions**  | URL is prefixed with a valid prefix (i.e. starts with    |
|                     | our server).                                             |
+---------------------+----------------------------------------------------------+
| **Post-Conditions** | User is presented with message.                          |
+---------------------+----------------------------------------------------------+
| **Basic Flow**      | 1. System informs user that document does not exist.     |
|                     | 2. System gives user option to create new document with  |
|                     |    invalid portion of URL as name.                       |
|                     | 3. User chooses Yes. [Alt. Flow]                         |
|                     | 4. Follow steps for creating a new document, fill in     |
|                     |    name with suffix of bad URL.                          |
+---------------------+----------------------------------------------------------+
| **Alternate Flow**  | 1. User chooses No.                                      |
|                     | 2. Browser navigates back to the page before the bad URL.|
+---------------------+----------------------------------------------------------+

Valid URL
^^^^^^^^^
+---------------------+----------------------------------------------------------+
| **Description**     | User enters valid URL.                                   |
+---------------------+----------------------------------------------------------+
| **Actors**          | User                                                     |
+---------------------+----------------------------------------------------------+
| **Pre-Conditions**  | Browser is open, user has entered valid URL of valid     |
|                     | document and user is navigating to that URL.             |
+---------------------+----------------------------------------------------------+
| **Post-Conditions** | Document is open.                                        |
+---------------------+----------------------------------------------------------+
| **Basic Flow**      | 1. System opens and displays in an editor the document   |
|                     |    that corresponds to URL entered.                      |
+---------------------+----------------------------------------------------------+
| **Alternate Flow**  | None                                                     |
+---------------------+----------------------------------------------------------+

Ordered List (Nestable)
^^^^^^^^^^^^^^^^^^^^^^^
+---------------------+----------------------------------------------------------+
| **Description**     | User begins creating a sequence of items.                |
+---------------------+----------------------------------------------------------+
| **Actors**          | User                                                     |
+---------------------+----------------------------------------------------------+
| **Pre-Conditions**  | * User must have document open, and have writing         |
|                     |   permission.                                            |
|                     | * User must have cursor in the position where user       |
|                     |   wants to add list (may be inside another list).        |
+---------------------+----------------------------------------------------------+
| **Post-Conditions** | List containing entered information is shown.            |
+---------------------+----------------------------------------------------------+
| **Basic Flow**      | 1. User pushes button that indicates that user wants to  |
|                     |    begin creating a list.                                |
|                     | 2. System shows some graphical indication that user is   |
|                     |    now in a "list-making environment" (such as           |
|                     |    indentation, or bullet point, or number).             |
|                     | 3. User enters an item into the list as if it were       |
|                     |    normal editing space.                                 |
|                     | 4. When user presses enter, system presents space for    |
|                     |    the next item. [Alt. Flow]                            |
|                     | 5. When user wishes to end the list context, he/she hits |
|                     |    backspace.                                            |
|                     | 6. System returns to normal editing space.               |
+---------------------+----------------------------------------------------------+
| **Alternate Flow**  | 1. User cancels sequence making operation                |
+---------------------+----------------------------------------------------------+

Tables
^^^^^^
+---------------------+----------------------------------------------------------+
| **Description**     | User wants to create a table.                            |
+---------------------+----------------------------------------------------------+
| **Actors**          | User                                                     |
+---------------------+----------------------------------------------------------+
| **Pre-Condition**   | User must have cursor in the position where user wants   |
|                     | to add table.                                            |
+---------------------+----------------------------------------------------------+
| **Post-Conditions** | Table is visible on document.                            | 
+---------------------+----------------------------------------------------------+
| **Basic Flow**      | 1. User pushes a button for creating a table.            |
|                     | 2. System prompts user for basic table size (rows,       |
|                     |    columns). [Alt. Flow]                                 |
|                     | 3. Table appears in document with cursor inside first    |
|                     |    cell.                                                 |
|                     | 4. User fills in information a cell at a time, tabbing   |
|                     |    to get to the next cell.                              |
|                     | 5. User clicks outside of table to continue editing      |
|                     |    normally.                                             |
+---------------------+----------------------------------------------------------+
| **Alternate Flow**  | 1. User cancels operation.                               |
|                     | 2. User is returned from dialog box to opened document.  |
+---------------------+----------------------------------------------------------+


Insert Table Row
^^^^^^^^^^^^^^^^
+---------------------+----------------------------------------------------------+
| **Description**     | User wants to add a row to a table.                      |
+---------------------+----------------------------------------------------------+
| **Actors**          | User                                                     |
+---------------------+----------------------------------------------------------+
| **Pre-Conditions**  | User must have table inside document.                    |
+---------------------+----------------------------------------------------------+
| **Post-Conditions** | Table has one more row.                                  |
+---------------------+----------------------------------------------------------+
| **Basic Flow**      | 1. User clicks in cell of row below where they want      |
|                     |    row inserted.                                         |
|                     | 2. User clicks button corresponding to inserting a row   |
|                     |    above the current row.                                |
|                     | 3. Row is inserted above selected row.                   |
+---------------------+----------------------------------------------------------+
| **Alternate Flow**  | 1. User clicks in cell of row above where they want      |
|                     |    row inserted.                                         |
|                     | 2. User clicks button corresponding to inserting a row   |
|                     |    below the current row.                                |
|                     | 3. Row in inserted below selected row.                   |
+---------------------+----------------------------------------------------------+

Insert Table Column
^^^^^^^^^^^^^^^^^^^
+---------------------+----------------------------------------------------------+
| **Description**     | User wants to add a column to a table.                   |
+---------------------+----------------------------------------------------------+
| **Actors**          | User                                                     |
+---------------------+----------------------------------------------------------+
| **Pre-Conditions**  | User must have table inside document.                    |
+---------------------+----------------------------------------------------------+
| **Post-Conditions** | Table has one more column.                               |
+---------------------+----------------------------------------------------------+
| **Basic Flow**      | 1. User user clicks in cell of column to the left of     |
|                     |    where they want the column inserted.                  |
|                     | 2. User clicks button corresponding to inserting a       |
|                     |    column to the right of the current row.               |
|                     | 3. System create another column to the right of the      |
|                     |    selected row in the table and makes it visible.       |
+---------------------+----------------------------------------------------------+
| **Alternate Flow**  | 1. User user clicks in cell of column to the right of    |
|                     |    where they want the column inserted.                  |
|                     | 2. User clicks button corresponding to inserting a       |
|                     |    column to the left of the current row.                |
|                     | 3. System create another column to the left of the       |
|                     |    selected row in the table and makes it visible.       |
+---------------------+----------------------------------------------------------+

Emphasis Attribute
^^^^^^^^^^^^^^^^^^
+---------------------+----------------------------------------------------------+
| **Description**     | User highlights a piece of text and applies the emphasis |
|                     | attribute.                                               |
+---------------------+----------------------------------------------------------+
| **Actors**          | User                                                     |
+---------------------+----------------------------------------------------------+
| **Pre-Conditions**  | User is logged in and has a document opened.             |
+---------------------+----------------------------------------------------------+
| **Post-Conditions** | User has the selected text marked as emphasis.           |
+---------------------+----------------------------------------------------------+
| **Basic Flow**      | 1. User highlights a piece of text. [Alt. Flow]          |
|                     | 2. User clicks on the "emphasis" button.                 |
|                     | 3. If any part of the highlighted text is not            |
|                     |    emphasized, mark it to be emphasized.                 |
+---------------------+----------------------------------------------------------+
| **Alternate Flow**  | 1. User clicks on the "emphasis" button.                 |
|                     | 2. User starts typing on the document.                   |
|                     | 3. Any text the user enters before the "emphasis" button |
|                     |    is clicked a second time will be emphasized.          |
+---------------------+----------------------------------------------------------+

Strong Attribute
^^^^^^^^^^^^^^^^
+---------------------+----------------------------------------------------------+
| **Description**     | User highlights a piece of text and applies the strong   |
|                     | attribute.                                               |
+---------------------+----------------------------------------------------------+
| **Actors**          | User                                                     |
+---------------------+----------------------------------------------------------+
| **Pre-Conditions**  | User is logged in and has a document opened.             |
+---------------------+----------------------------------------------------------+
| **Post-Conditions** | User has the selected text marked as strong.             |
+---------------------+----------------------------------------------------------+
| **Basic Flow**      | 1. User highlights a piece of text. [Alt. Flow]          |
|                     | 2. User clicks on the "strong" button.                   |
|                     | 3. If any part of the highlighted text is not marked as  |
|                     |    strong, mark it as strong.                            |
+---------------------+----------------------------------------------------------+
| **Alternate Flow**  | 1. User clicks on the "strong" button.                   |
|                     | 2. User starts typing on the document.                   |
|                     | 3. Any text the user enters before the "strong" button   |
|                     |    is clicked a second time will be marked as strong.    |
+---------------------+----------------------------------------------------------+


Undo
^^^^
+---------------------+----------------------------------------------------------+
| **Description**     | User hits the undo button and the last action is undone. |
+---------------------+----------------------------------------------------------+
| **Actors**          | User                                                     |
+---------------------+----------------------------------------------------------+
| **Pre-Conditions**  | User is logged in and has a document open.               |
+---------------------+----------------------------------------------------------+
| **Post-Conditions** | User has a document that has been in a previous state.   |
+---------------------+----------------------------------------------------------+
| **Basic Flow**      | 1. User hits the undo button.                            |
|                     | 2. The system checks to see if there is an action that   |
|                     |    can be undone.                                        |
|                     | 3. The system undoes the most previous action and        |
|                     |    displays the document in that state. [Alt. Flow]      |
+---------------------+----------------------------------------------------------+
| **Alternate Flow**  | 1. There are no more actions that can be undone.         |
|                     | 2. Document is left in the state before the undo button. |
+---------------------+----------------------------------------------------------+


Redo
^^^^
+---------------------+----------------------------------------------------------+
| **Description**     | User hits the redo button and the last action is redone. |
+---------------------+----------------------------------------------------------+
| **Actors**          | User                                                     |
+---------------------+----------------------------------------------------------+
| **Pre-Conditions**  | User is logged in and has a document open.               |
+---------------------+----------------------------------------------------------+
| **Post-Conditions** | User has a document that has been in a previous state.   |
+---------------------+----------------------------------------------------------+
| **Basic Flow**      | 1. User hits the redo button.                            |
|                     | 2. The system checks to see if there is an action that   |
|                     |    can be redone.                                        |
|                     | 3. The system redoes the most previous action [Alt. Flow]|
|                     | 4. System displays changed document.                     |
+---------------------+----------------------------------------------------------+
| **Alternate Flow**  | 1. There are no more actions that can be redone.         |
|                     | 2. Document is left in the state before the redo button. |
+---------------------+----------------------------------------------------------+

Hyperlink
^^^^^^^^^
+---------------------+----------------------------------------------------------+
| **Description**     | User creates hyperlink in document.                      |
+---------------------+----------------------------------------------------------+
| **Actors**          | User                                                     |
+---------------------+----------------------------------------------------------+
| **Pre-Conditions**  | User is logged in and has a document open.               |
+---------------------+----------------------------------------------------------+
| **Post-Conditions** | User has created a link from one document to another.    |
+---------------------+----------------------------------------------------------+
| **Basic Flow**      | 1. User highlights a piece of text.                      |
|                     | 2. User clicks on the "link" button.                     |
|                     | 3. System presents user with dialog box.                 |
|                     | 4. User enters URL path, and title. [Alt. Flow]          |
|                     | 5. User clicks submit.                                   |
|                     | 6. System modifies highlighted text to be a hyperlink    |
|                     |    with the attributes specified by the user.            |
+---------------------+----------------------------------------------------------+
| **Alternate Flow**  | 1. User cancels operation and closes dialog box.         |
+---------------------+----------------------------------------------------------+

Collaborative Edit
^^^^^^^^^^^^^^^^^^
+---------------------+----------------------------------------------------------+
| **Description**     | Users edit document concurrently.                        |
+---------------------+----------------------------------------------------------+
| **Actors**          | Multiple Users                                           |
+---------------------+----------------------------------------------------------+
| **Pre-Conditions**  | Users are logged in and have a document open.            |
+---------------------+----------------------------------------------------------+
| **Post-Conditions** | All users see edit made to document.                     |
+---------------------+----------------------------------------------------------+
| **Basic Flow**      | 1. User makes an edit to a document. [Alt. Flow]         |
|                     | 2. System records change and sends out message to all    |
|                     |    all clients.                                          |
|                     | 3. All users' browsers update display to reflect change. |
+---------------------+----------------------------------------------------------+
| **Alternate Flow**  | None                                                     |
+---------------------+----------------------------------------------------------+

Collaborative Chat Environment
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
+---------------------+----------------------------------------------------------+
| **Description**     | User initiates chat amongst users editing document.      |
+---------------------+----------------------------------------------------------+
| **Actors**          | Multiple Users                                           |
+---------------------+----------------------------------------------------------+
| **Pre-Conditions**  | Users are logged in and have a document open.            |
+---------------------+----------------------------------------------------------+
| **Post-Conditions** | All users see chat in real-time.                         |
+---------------------+----------------------------------------------------------+
| **Basic Flow**      | 1. User is shown current users and recent chat messages  |
|                     |    in a sidebar on the user interface.                   |
|                     | 3. User enters chat messages into chat field, pressing   |
|                     |    "Enter" after each message.                           |
|                     | 3. Each chat message is sent to all other users present  |
|                     |    in the document editing session.                      |
+---------------------+----------------------------------------------------------+
| **Alternate Flow**  | None                                                     |
+---------------------+----------------------------------------------------------+

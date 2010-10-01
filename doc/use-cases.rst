Use Cases
=========

Common Alternate Flows
----------------------
There are several alternate flows that can occur in nearly every standard use case. They are outlined here and should be considered viable possibilities at any stage of operation. 

Server Unreachable
^^^^^^^^^^^^^^^^^^
+---------------------+----------------------------------------------------------+
| **Description**     | Server name lookup failed                                |
+---------------------+----------------------------------------------------------+
| **Actors**          | User                                                     |
+---------------------+----------------------------------------------------------+
| **Pre-Conditions**  | Any action that needs to contact server has been         |
|                     | initiated                                                |
+---------------------+----------------------------------------------------------+
| **Post-Conditions** | System returned to state before failed action occurred   |
+---------------------+----------------------------------------------------------+
| **Basic Flow**      | 1. System informs user that server could not be reached  |
|                     | 2. System suggests that user check to see that they are  |
|                     |    connected to the internet                             |
+---------------------+----------------------------------------------------------+

Server Timeout
^^^^^^^^^^^^^^
+---------------------+----------------------------------------------------------+
| **Description**     | Server could not respond in a timely fashion             |
+---------------------+----------------------------------------------------------+
| **Actors**          | User                                                     |
+---------------------+----------------------------------------------------------+
| **Pre-Conditions**  | Any action that needs to contact server has been         |
|                     | initiated                                                |
+---------------------+----------------------------------------------------------+
| **Post-Conditions** | System returned to state before failed action occurred   |
+---------------------+----------------------------------------------------------+
| **Basic Flow**      | 1. System informs user that it cannot reach the server   |
|                     | 2. System kindly requests that user try the action again |
|                     |    later                                                 |
+---------------------+----------------------------------------------------------+


Use Case Flows
--------------

Creating a New Document
^^^^^^^^^^^^^^^^^^^^^^^
+---------------------+----------------------------------------------------------+
| **Description**     | User creates a new document                              |
+---------------------+----------------------------------------------------------+
| **Actors**          | User                                                     |
+---------------------+----------------------------------------------------------+
| **Pre-Conditions**  | Must have a web browser and network connection           |
+---------------------+----------------------------------------------------------+
| **Post-Conditions** | User's browser is currently displaying new document      |
+---------------------+----------------------------------------------------------+
| **Basic Flow**      | 1. User goes to specific URL                             |
|                     | 2. The system generates a new document with a unique URL |
|                     | 3. The system redirects the user to the new URL          |
+---------------------+----------------------------------------------------------+
| **Alternate Flow**  | 1. Server does not respond                               |
|                     | 2. System                                                |
+---------------------+----------------------------------------------------------+

View Prior Change
^^^^^^^^^^^^^^^^^
+---------------------+----------------------------------------------------------+
| **Description**     | Ability to view any prior change made to a document      |
+---------------------+----------------------------------------------------------+
| **Actors**          | User                                                     |
+---------------------+----------------------------------------------------------+
| **Pre-Conditions**  | Document must exist and be currently open                |
+---------------------+----------------------------------------------------------+
| **Post-Conditions** | User's browser displays prior changes made, if any       |
+---------------------+----------------------------------------------------------+
| **Basic Flow**      | 1. User clicks on button in interface                    |
|                     | 2. Opens a new window containing a revision log          |
+---------------------+----------------------------------------------------------+
| **Alternate Flow**  | 1. Hello World                                           |
|                     | 2. Godbye World                                          |
+---------------------+----------------------------------------------------------+

Bad URL
^^^^^^^
+---------------------+----------------------------------------------------------+
| **Description**     | User enters URL that doesn't exist as a document, i.e.   |
|                     | invalid obfuscated url                                   |
+---------------------+----------------------------------------------------------+
| **Actors**          | User                                                     |
+---------------------+----------------------------------------------------------+
| **Pre-Conditions**  | URL is prefixed with a valid prefix (i.e. starts with    |
|                     | our server)                                              |
+---------------------+----------------------------------------------------------+
| **Post-Conditions** | User is presented with message                           |
+---------------------+----------------------------------------------------------+
| **Basic Flow**      | 1. System informs user that document does not exist      |
|                     | 2. System gives user option to create new document with  |
|                     |    invalid portion of url as name                        |
|                     | 3. User chooses Yes                                      |
|                     | 4. Follow steps for creating a new document, fill in     |
|                     |    name with suffix of bad url                           |
+---------------------+----------------------------------------------------------+
| **Alternate Flow**  | 3. User chooses No                                       |
|                     | 4. Return to index of documents                          |
+---------------------+----------------------------------------------------------+

Valid URL
^^^^^^^^^
+---------------------+----------------------------------------------------------+
| **Description**     | User enters valid URL                                    |
+---------------------+----------------------------------------------------------+
| **Actors**          | User                                                     |
+---------------------+----------------------------------------------------------+
| **Pre-Conditions**  | Browser is open, user has entered valid url of valid     |
|                     | document and user is navigating to that URL.             |
+---------------------+----------------------------------------------------------+
| **Post-Conditions** | Document open                                            |
+---------------------+----------------------------------------------------------+
| **Basic Flow**      | 1) System opens document that corresponds to url entered |
+---------------------+----------------------------------------------------------+
| **Alternate Flow**  | None                                                     |
+---------------------+----------------------------------------------------------+

Ordered List (Nestable)
^^^^^^^^^^^^^^^^^^^^^^^
+---------------------+----------------------------------------------------------+
| **Description**     | User begins creating a sequence of items                 |
+---------------------+----------------------------------------------------------+
| **Actors**          | User                                                     |
+---------------------+----------------------------------------------------------+
| **Pre-Conditions**  | * User must have document open, and have writing         |
|                     |   permission.                                            |
|                     | * User must have cursor in the position where user       |
|                     |   wants to add list (may be inside another list)         |
+---------------------+----------------------------------------------------------+
| **Post-Conditions** | List containing entered information is shown             |
+---------------------+----------------------------------------------------------+
| **Basic Flow**      | 1. User pushes button that indicates that user wants to  |
|                     |    begin creating a list                                 |
|                     | 2. System shows some graphical indication that user is   |
|                     |    now in a "list-making environment" (such as           |
|                     |    indentation, or bullet point, or number)              |
|                     | 3. User enters an item into the list as if it were       |
|                     |    normal editing space                                  |
|                     | 4. When user presses enter, system presents space for    |
|                     |    the next item                                         |
|                     | 5. When user wishes to end the list context, he/she hits |
|                     |    backspace                                             |
|                     | 6. System returns to normal editing space                |
+---------------------+----------------------------------------------------------+
| **Alternate Flow**  | None                                                     |
+---------------------+----------------------------------------------------------+

Tables
^^^^^^
+---------------------+----------------------------------------------------------+
| **Description**     | User wants to create a table                             |
+---------------------+----------------------------------------------------------+
| **Actors**          | User                                                     |
+---------------------+----------------------------------------------------------+
| **Pre-Conditions**  | * User must have document open, and have writing         |
|                     |   permission.                                            |
|                     | * User must have cursor in the position where user wants |
|                     |   to add table                                           |
+---------------------+----------------------------------------------------------+
| **Post-Conditions** | Table is visible on document                             | 
+---------------------+----------------------------------------------------------+
| **Basic Flow**      | 1. User pushes a button for creating a table             |
|                     | 2. System prompts user for basic table size (rows,       |
|                     |    columns)                                              |
|                     | 3. Table appears in document with cursor inside first    |
|                     |    cell                                                  |
|                     | 4. User fills in information a cell at a time, tabbing   |
|                     |    to get to the next cell                               |
|                     | 5. User clicks outside of table to continue editing      |
|                     |    normally                                              |
+---------------------+----------------------------------------------------------+
| **Alternate Flow**  | None                                                     |
+---------------------+----------------------------------------------------------+


Insert Table Row
^^^^^^^^^^^^^^^^
+---------------------+----------------------------------------------------------+
| **Description**     | User wants to add a row to a table                       |
+---------------------+----------------------------------------------------------+
| **Actors**          | User                                                     |
+---------------------+----------------------------------------------------------+
| **Pre-Conditions**  | * User must have document open, and have writing         |
|                     |   permission                                             |
|                     | * User must have table inside document                   |
+---------------------+----------------------------------------------------------+
| **Post-Conditions** | Table has one more row                                   |
+---------------------+----------------------------------------------------------+
| **Basic Flow**      | 1. User puts cursor in cell of row below where they want |
|                     |    row inserted                                          |
|                     | 2. User pushes button for inserting a row                |
|                     | 3. Row is inserted above row that cursor is currently    |
|                     |    in place                                              |
+---------------------+----------------------------------------------------------+
| **Alternate Flow**  | 1. User attempts to insert row at bottom                 |
|                     | 2. User puts cursor in last cell of table                |
|                     | 3. User hits enter                                       |
|                     | 4. System creates another row at bottom of table and     |
|                     |    makes visible                                         |
+---------------------+----------------------------------------------------------+

Insert Table Column
^^^^^^^^^^^^^^^^^^^
+---------------------+----------------------------------------------------------+
| **Description**     | User wants to add a column to a table                    |
+---------------------+----------------------------------------------------------+
| **Actors**          | User                                                     |
+---------------------+----------------------------------------------------------+
| **Pre-Conditions**  | * User must have document open, and have writing         |
|                     |   permission                                             |
|                     | * User must have table inside document                   |
+---------------------+----------------------------------------------------------+
| **Post-Conditions** | Table has one more column                                |
+---------------------+----------------------------------------------------------+
| **Basic Flow**      | 1. User selects column where they want column entered    |
|                     | 2. User pushes button for inserting column               |
|                     | 3. System create another column in the table and makes   |
|                     |    visible                                               |
+---------------------+----------------------------------------------------------+
| **Alternate Flow**  | None                                                     |
+---------------------+----------------------------------------------------------+



Strong Emphasis
^^^^^^^^^^^^^^^
+---------------------+----------------------------------------------------------+
| **Description**     | User highlights a piece of text and the highlighted text |
|                     | is in a strong emphasis format.                          |
+---------------------+----------------------------------------------------------+
| **Actors**          | User                                                     |
+---------------------+----------------------------------------------------------+
| **Pre-Conditions**  | User is logged in and has a document opened.             |
+---------------------+----------------------------------------------------------+
| **Post-Conditions** | User has the selected text in strong emphasis.           |
+---------------------+----------------------------------------------------------+
| **Basic Flow**      | 1. User highlights a piece of text.                      |
|                     | 2. User clicks on the "strong emphasis" button.          |
|                     | 3. System checks if piece of text is strong emphasized.  |
|                     | 4. (Conditional)                                         |
|                     |   a. If text is completely strong emphasized, do         |
|                     |      nothing.                                            |
|                     |   b. If text is partially or not strong emphasized at    |
|                     |      all, convert all highlighted text to strong         |
|                     |      emphasis.                                           |
+---------------------+----------------------------------------------------------+
| **Alternate Flow**  | 1. User clicks on the "strong emphasis" button.          |
|                     | 2. The system marks the button as being pressed.         |
|                     | 3. User starts typing on the document.                   |
|                     | 4. The text the user is just typing is strong            |
|                     |    emphasized.                                           |
+---------------------+----------------------------------------------------------+

Bold
^^^^
+---------------------+----------------------------------------------------------+
| **Description**     | User highlights a piece of text and the highlighted text |
|                     | is bolded.                                               |
+---------------------+----------------------------------------------------------+
| **Actors**          | User                                                     |
+---------------------+----------------------------------------------------------+
| **Pre-Conditions**  | User is logged in and has a document opened.             |
+---------------------+----------------------------------------------------------+
| **Post-Conditions** | User has the selected text bolded.                       |
+---------------------+----------------------------------------------------------+
| **Basic Flow**      | 1. User highlights a piece of text.                      |
|                     | 2. User clicks on the "bold" button.                     |
|                     | 3. System checks if piece of text is bold.               |
|                     | 4. (Conditional)                                         |
|                     |   a. If text is completely bolded, do nothing.           |
|                     |   b. If text is partially or not bolded at all, convert  |
|                     |      all highlighted text to bold.                       |
+---------------------+----------------------------------------------------------+
| **Alternate Flow**  | 1. User clicks on the "bold" button.                     |
|                     | 2. The system marks the button as being pressed.         |
|                     | 3. User starts typing on the document.                   |
|                     | 4. The text the user is just typing is bolded.           |
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
|                     | 3. (Conditional)                                         |
|                     |   a. If there is an action that can be undone, the       |
|                     |      system undoes the most previous action and displays |
|                     |      the document in that state.                         |
|                     |   b. If there are no more actions that can be undone,    |
|                     |      the system displays a message and the document in   |
|                     |      the current state.                                  |
+---------------------+----------------------------------------------------------+
| **Alternate Flow**  | None                                                     |
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
|                     | 3. (Conditional)                                         |
|                     |  a. If there is an action that can be redone, the        |
|                     |     system redoes the most previous action and displays  |
|                     |     the document in that state.                          |
|                     |  b. If there are no more actions that can be redone, the |
|                     |     system displays a message and the document in the    |
|                     |     current state.                                       |
+---------------------+----------------------------------------------------------+
| **Alternate Flow**  | None                                                     |
+---------------------+----------------------------------------------------------+

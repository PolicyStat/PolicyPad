Features
=========

begin{feature}[Description]{Features will be listed in the following format:}
\featurebody
{Identifies the features current status related to the project as a whole. 
Ex. Proposed, Approved, On Hold, In development, Incorporated}
{Ranking of how important the given feature is relative to the other features. 
Ex. Critical, Important, Useful, Unimportant}
{Expected amount of work required to complete the feature. 
Ex. Low, Medium, High}
{Probability that feature will produce unexpected results and events. 
Ex. Low, Medium, High}
{Represents the team's confidence level that the the understanding of and requirements for a feature will not change. 
Ex. Low, Medium, High}
{The release version that is first expected to contain this feature. 
Ex. 1.2}
{The team member or team designated for being responsible for the feature throughout its development cycle. 
Ex. Jacob, server team}
{Reference to documentation where feature first originated. 
Ex. Meeting minute marker}
\end{feature}


\begin{itemize}

\begin{feature}{\item Ability to create a new document and generate a persistent link to that project's workspace.}
\featurebody
{Approved}
{Critical}
{Low}
{Low}
{Medium}
{0.1}
{Server Team}
{A collaborative document editing environment would be rather useless if it is not possible to create new documents to edit.  First discussed during 9/14/10 client meeting \cite{minutes9_14_10}.}
\end{feature}

\begin{feature}{\item Ability to view any prior change made to a document.  It would also be convenient to playback the lifetime of the document to visualize how the document reached its current state.}
\featurebody
{Approved}
{Important}
{Medium}
{Medium}
{High}
{0.9}
{Development Team}
{This feature exposes the document's revision history to the user.  First discussed during 9/14/10 client meeting \cite{minutes9_14_10}.}
\end{feature}

\begin{feature}{\item Mark an existing document as deleted (while retaining all prior version information).}
\featurebody
{Proposed}
{Unimportant}
{Low}
{Medium}
{Medium}
{0.9}
{Server Team}
{A document may reach a point that it is no longer useful and should be removed from any listing of documents.  Currently proposed by development team, but not yet accepted by client.}
\end{feature}

\begin{feature}{\item View a list of other users that are currently actively editing the document.}
\featurebody
{Approved}
{Useful}
{Low}
{Low}
{High}
{0.1}
{Server Team}
{It would be useful to view which users are currently editing the document.  Current feature of PiratePad, which this project is modeling.}
\end{feature}

\begin{feature}{\item Changes should be syncronized amongst users concurrently, allowing for concurrent editing even up to the same line of text seeing other users' changes as close to immediately as possible.}
\featurebody
{Approved}
{Critical}
{High}
{Medium}
{High}
{0.1}
{Development Team}
{The purpose of this project is to allow concurrent, collaborative editing of the same document. First discussed during 9/14/10 client meeting \cite{minutes9_14_10}.}
\end{feature}

\begin{feature}{\item Comprehensive API documentation for the web server interface allowing future development of various front ends.  Client/Server communication should utilize a open protocol such as \gls{json}.}
\featurebody
{Approved}
{Critical}
{Medium}
{Low}
{Medium}
{0.1}
{API Team}
{The front end design for this project will be designed as a throw away interface.  It is the intention of the client to design their own front end using the exposed APIs to communicate with the server. First discussed during 9/14/10 client meeting \cite{minutes9_14_10}.}
\end{feature}

\begin{feature}{\item Changes should be made via a WYSIWYG editor that hides the actual HTML being edited from the user.}
\featurebody
{Approved}
{Critical}
{High}
{High}
{High}
{0.9}
{Client Team}
{As previously stated, the purpose of this project is to provide a collaborative WYSIWYG editor.  This editor is the most important feature of the client. First discussed during 9/14/10 client meeting \cite{minutes9_14_10}.}
\end{feature}

\begin{feature}{\item Ability to view the current revision of a webpage as a standalone webpage, as opposed to the collaborative editing environment.}
\featurebody
{Proposed}
{Useful}
{Low}
{Low}
{Medium}
{0.9}
{Development Team}
{The ultimate goal of editing documents online is to produce a final document.  This feature will allow that document to be viewed without the overhead of the editing environment.  Current feature of PiratePad, which this project is modeling.}
\end{feature}

\begin{feature}{\item Collaborative chat environment allowing currently connected users to discuss the active edits.  The chat history should be maintained as part of the document's history and be available for playback.}
\featurebody
{Proposed}
{Useful}
{Medium}
{Low}
{Low}
{0.9}
{Development Team}
{A chat interface would allow editors to comment their changes to the document and discuss changes with other users.  This record can serve the purpose of commit messages that are common with other \gls{vcs}.  PiratePad currently contains a chat feature, but does not version control the chat history.  We propose this feature to offer a higher sense of version control.}
\end{feature}
\end{itemize}
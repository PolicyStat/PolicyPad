Extending PolicyPad
===================

Adding Support for Other Editors
--------------------------------

PolicyPad includes support for WymEditor by default, but it can be easily
extended to support any HTML editor, so long as it can conform to the proper
interface.  In the constructor for the class for the new editor, simply pass a
reference to the object that adheres to the following interface:

status(msg, [persistent])
  Called when PolicyPad wants to provide a status update to the user.  These
  messages are for information only, and can be safely ignored.  The persistent
  flag, if set, indicates whether or not the message should be displayed until
  it is explicitly replaced with another message.  Again, this flag is just a
  suggestion, and an implementing GUI can handle this flag however it wishes.

html([val])
  If val is set, the contents of the editor should be replaced with the text
  contained in val.  If val is undefined, the method should return the browser
  specific form of the contents of the document.  The value returned by this
  method is used to help determine if the document has changed.

xhtml()
  Retrieve the current html content of the document.  The value returned by this
  function should be independent of the platform the editor is running on
  because this value is what will be synchronized between clients.

refreshUsers()
  If the GUI wants to display a list of connected users, the GUI should refresh
  that list whenever this method is invoked.  Specifics as to the action that
  occurred are not provided, but that information can be retrieved via the
  getUserList() method of the PolicyPad instance.

saveSelection()
  Before replacing the contents of the editor, PolicyPad will prompt the GUI to
  save the current cursor position/selection so that it can later be restored.

restoreSelection()
  Indicates that the editor should restore the previously saved cursor
  position/selection.

Aside from implementing the provided interface, the new editor plugin must also
indicate when the state of the document has changed.  This action can by
accomplished by calling the submitChanges() method of the PolicyPad instance.

Running the PolicyPad Test Suite
--------------------------------

The suite of test cases included with PolicyPad can be run by viewing the
index.html page located in the test folder of PolicyPad's root directory.  These
tests are specific to the various changeset operations required for PolicyPad to
interact with EtherPad, but the test cases themselves do not communicate with
EtherPad and should not require any special configuration.

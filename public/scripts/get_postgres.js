/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var Comment = React.createClass({
  rawMarkup: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return { __html: rawMarkup };
  },

  render: function() {
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.name}
        </h2>
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
      </div>
    );
  }
});

var CommentBox = React.createClass({
  // This ajax call works and routine returns dataset from dtabase
  handleCommentSubmit: function() {
    console.log('handleCommentSubmit get request starting');
    $.ajax({
      url: "/d",
      dataType: "html",
      cache: false,
      success: function(data) {
        console.log('example.js get success');
        console.log('success data: ');
        console.log(data);
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.log('in the error handling routine');
        //console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  getInitialState: function() {
    return {data: []};
  },
  // componentDidMount: function() {
  //   this.loadCommentsFromServer();
  //   setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  // },
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }
});

var CommentList = React.createClass({
  render: function() {
    //TODO this.props.data returns a copy of the html file
    //not sure why
    //console.log(this.props.data);
    // var commentNodes = this.props.data.map(function(comment, index) {
    //   return (
    //     // `key` is a React-specific concept and is not mandatory for the
    //     // purpose of this tutorial. if you're curious, see more here:
    //     // http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
    //     <Comment name={comment.name} key={index}>
    //       {comment.comment}
    //     </Comment>
    //   );
    // });
    return (
      <div className="commentList">

      </div>
    );
  }
});

var CommentForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var name = React.findDOMNode(this.refs.name).value.trim();
    var comment = React.findDOMNode(this.refs.comment).value.trim();
    if (!comment || !name) {
      return;
    }
    this.props.onCommentSubmit({name: name, comment: comment});
    React.findDOMNode(this.refs.name).value = '';
    React.findDOMNode(this.refs.comment).value = '';
  },
  render: function() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your name" ref="name" />
        <input type="text" placeholder="Say something..." ref="comment" />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

React.render(
  <CommentBox url="/" pollInterval={2000} />,
  document.getElementById('content')
);

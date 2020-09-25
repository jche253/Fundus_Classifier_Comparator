
##  Image Comparator

User Interface, Algorithms and Database for allowing users to compare (sort) images, usually by choosing in 
a pairwise way between 2 images.


## File Organization

Files are organized in folders. 

. User Interface ("ui") - functionally, display the criterion, the images, and get the better match as, e.g., -1, 0, 1
. Results - Files for processing and displaying results
. Feeders - Algorithms that access Results to determine the next pair of images for the UI
. Vendor - Third Party dependencies
. Database Utilities ("dbutil") - mostly ruby scripts for processing data
. ("rubyUtils") - same as dbutil (?)


## Third Party Dependencies

Currently used modules (found in the folder "vendor")

0. JQuery
1. Bootstrap
2. CouchDB
3. D3

## Coding Conventions and Styles

For multiple file javascript, we're primarily using "Module with Loose Augmentation".  
See, for example, 
http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html




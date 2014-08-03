stylecow plugin msfilter-transform
==================================

Stylecow plugin to add ms filters emulating some 2d transforms: rotate(), scale(), skew(), matrix(), etc

Some code has been taken from https://github.com/pbakaus/transformie (thanks so much, guys!!)

You write:

```css
p {
	transform: skew(30deg, 10deg);
}
```

And stylecow converts to:

```css
p {
	transform: skew(30deg, 10deg);
	-ms-filter: 'progid:DXImageTransform.Microsoft.Matrix(sizingMethod="auto expand", M11 = 1, M12 = 0, M21 = 0.5773502691896257, M22 = 1)';
}
```

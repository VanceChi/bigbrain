export default function Form({
  onSubmit,
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  error,
  validationError,
  buttonText,
  autoComplete = "off",
  className = "p-6 bg-bigbrain-milky-white rounded shadow-md",
}) {
  return (
    <form
      onSubmit={onSubmit}
      className={className}
      autoComplete={autoComplete}
    >
      {name !== undefined && setName && (
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="block w-full p-2 border rounded"
            autoComplete="off"
          />
        </div>
      )}
      {email !== undefined && setEmail && (
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="block w-full p-2 border rounded"
            autoComplete="off"
          />
        </div>
      )}
      {password !== undefined && setPassword && (
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="block w-full p-2 border rounded bg-bigbrain-milky-white"
            autoComplete="off"
          />
        </div>
      )}
      {confirmPassword !== undefined && setConfirmPassword && (
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="block w-full p-2 border rounded bg-bigbrain-milky-white"
            autoComplete="off"
          />
        </div>
      )}
      {validationError && (
        <div className="flex items-center text-red-500 mb-4 text-sm font-medium p-3 rounded bg-gradient-to-r from-blue-100 to-blue-200 shadow-md">
          <span className="text-orange-500 mr-2">!</span>
          <p role="alert">{validationError}</p>
        </div>
      )}
      {error && (
        <p
          role="alert"
          className="text-red-500 mb-4 text-sm font-medium p-3 rounded bg-gradient-to-r from-blue-100 to-blue-200 shadow-md bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2220%22 height=%2220%22 viewBox=%220 0 20 20%22%3E%3Ccircle cx=%2210%22 cy=%2210%22 r=%228%22 fill=%22none%22 stroke=%22%23E0E7FF%22 stroke-width=%221%22 opacity=%220.5%22/%3E%3C/svg%3E')] bg-repeat"
        >
          {error}
        </p>
      )}
      <button
        type="submit"
        className="bg-bigbrain-light-pink font-bold w-full p-2 text-white rounded hover:bg-bigbrain-dark-pink hover:cursor-pointer"
      >
        {buttonText}
      </button>
    </form>
  );
}